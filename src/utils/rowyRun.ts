import { RunRoute } from "@src/constants/runRoutes";

export interface IRowyRunRequestProps {
  serviceUrl: string;
  authToken?: string;
  route: RunRoute;
  body?: any;
  params?: string[];
  localhost?: boolean;
  json?: boolean;
  signal?: AbortSignal;
}

export const rowyRun = async ({
  serviceUrl,
  authToken,
  route,
  body,
  params,
  localhost = false,
  json = true,
  signal,
}: IRowyRunRequestProps) => {
  const { method, path } = route;
  let url = (localhost ? "http://localhost:8080" : serviceUrl) + path;
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
    body: body && method !== "GET" ? JSON.stringify(body) : null, // body data type must match "Content-Type" header
    signal,
  });

  if (json) return await response.json();
  return response;
};
