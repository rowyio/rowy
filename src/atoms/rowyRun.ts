import { atom } from "jotai";
import { selectAtom, atomWithStorage } from "jotai/utils";
import { isEqual } from "lodash-es";
import { getIdTokenResult } from "firebase/auth";

import { projectSettingsAtom } from "./project";
import { currentUserAtom } from "./auth";
import { RunRoute } from "@src/constants/runRoutes";
import meta from "@root/package.json";

/**
 * Get rowyRunUrl from projectSettings, but only update when this field changes */
const rowyRunUrlAtom = selectAtom(
  projectSettingsAtom,
  (projectSettings) => projectSettings.rowyRunUrl
);
/**
 * Get services from projectSettings, but only update when this field changes
 */
const rowyRunServicesAtom = selectAtom(
  projectSettingsAtom,
  (projectSettings) => projectSettings.services,
  isEqual
);

export interface IRowyRunRequestProps {
  /** Optionally force refresh the token */
  forceRefresh?: boolean;
  service?: "hooks" | "builder";
  /** Optionally use Rowy Run instance on localhost */
  localhost?: boolean;

  route: RunRoute;
  body?: any;
  /** Params appended to the URL. Will be transforme to a `/`-separated string. */
  params?: string[];
  /** Parse response as JSON. Default: true */
  json?: boolean;
  /** Optionally pass an abort signal to abort the request */
  signal?: AbortSignal;
}

/**
 * An atom that returns a function to call Rowy Run endpoints using the URL
 * defined in project settings and retrieving a JWT token
 *
 * @example Basic usage:
 * ```
 * const [rowyRun] = useAtom(rowyRunAtom, globalScope);
 * ...
 * await rowyRun(...);
 * ```
 */
export const rowyRunAtom = atom((get) => {
  const rowyRunUrl = get(rowyRunUrlAtom);
  const rowyRunServices = get(rowyRunServicesAtom);
  const currentUser = get(currentUserAtom);

  return async ({
    forceRefresh,
    localhost = false,
    service,
    route,
    params,
    body,
    signal,
    json = true,
  }: IRowyRunRequestProps): Promise<Response | any | void> => {
    if (!currentUser) {
      console.log("Rowy Run: Not signed in");
      return;
    }
    const authToken = await getIdTokenResult(currentUser!, forceRefresh);

    const serviceUrl = localhost
      ? "http://localhost:8080"
      : service
      ? rowyRunServices?.[service]
      : rowyRunUrl;
    if (!serviceUrl) {
      console.log("Rowy Run: Not set up");
      return;
    }

    const { method, path } = route;
    let url = serviceUrl + path;
    if (params && params.length > 0) url = url + "/" + params.join("/");

    const response = await fetch(url, {
      method: method,
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + authToken,
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
      // body data type must match "Content-Type" header
      body: body && method !== "GET" ? JSON.stringify(body) : null,
      signal,
    });

    if (json) return await response.json();
    return response;
  };
});

type RowyRunLatestUpdate = {
  lastChecked: string;
  rowy: null | Record<string, any>;
  rowyRun: null | Record<string, any>;
  deployedRowy: string;
  deployedRowyRun: string;
};
/** Store latest update from GitHub releases and currently deployed versions */
export const rowyRunLatestUpdateAtom = atomWithStorage<RowyRunLatestUpdate>(
  "__ROWY__UPDATE_CHECK",
  {
    lastChecked: "",
    rowy: null,
    rowyRun: null,
    deployedRowy: meta.version,
    deployedRowyRun: "",
  }
);
