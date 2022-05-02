import { atom } from "jotai";
import { sortBy } from "lodash-es";
import { ThemeOptions } from "@mui/material";

import { userRolesAtom } from "./auth";
import { UpdateDocFunction, UpdateCollectionFunction } from "@src/atoms/types";
import { UserSettings } from "./user";

export const projectIdAtom = atom<string>("");

/** Public settings are visible to unauthenticated users */
export type PublicSettings = Partial<{
  signInOptions: Array<
    | "google"
    | "twitter"
    | "facebook"
    | "github"
    | "microsoft"
    | "apple"
    | "yahoo"
    | "email"
    | "phone"
    | "anonymous"
  >;
  theme: Record<"base" | "light" | "dark", ThemeOptions>;
}>;
/** Public settings are visible to unauthenticated users */
export const publicSettingsAtom = atom<PublicSettings>({});
/** Stores a function that updates public settings */
export const updatePublicSettingsAtom =
  atom<UpdateDocFunction<PublicSettings> | null>(null);

/** Project settings are visible to authenticated users */
export type ProjectSettings = Partial<{
  tables: TableSettings[];

  setupCompleted: boolean;

  rowyRunUrl: string;
  rowyRunRegion: string;
  rowyRunBuildStatus: "BUILDING" | "COMPLETE";
  services: Partial<{
    hooks: string;
    builder: string;
    terminal: string;
  }>;
}>;
/** Project settings are visible to authenticated users */
export const projectSettingsAtom = atom<ProjectSettings>({});
/** Stores a function that updates project settings */
export const updateProjectSettingsAtom =
  atom<UpdateDocFunction<ProjectSettings> | null>(null);

/** Table settings stored in project settings */
export type TableSettings = {
  id: string;
  collection: string;
  name: string;
  roles: string[];

  description: string;
  section: string;

  tableType: "primaryCollection" | "collectionGroup";

  audit?: boolean;
  auditFieldCreatedBy?: string;
  auditFieldUpdatedBy?: string;
  readOnly?: boolean;
};
/** Tables visible to the signed-in user based on roles */
export const tablesAtom = atom<TableSettings[]>((get) => {
  const userRoles = get(userRolesAtom);
  const tables = get(projectSettingsAtom).tables || [];

  return sortBy(tables, "name")
    .filter(
      (table) =>
        userRoles.includes("ADMIN") ||
        table.roles.some((role) => userRoles.includes(role))
    )
    .map((table) => ({
      ...table,
      // Ensure id exists for backwards compatibility
      id: table.id || table.collection,
      // Ensure section exists
      section: table.section ? table.section.trim() : "Other",
    }));
});

/** Roles used in the project based on table settings */
export const rolesAtom = atom((get) =>
  Array.from(
    new Set(
      get(tablesAtom).reduce(
        (a, c) => [...a, ...c.roles],
        ["ADMIN", "EDITOR", "VIEWER"]
      )
    )
  )
);

/** User management page: all users */
export const allUsersAtom = atom<UserSettings[]>([]);
/** Stores a function that updates a user document */
export const updateUserAtom =
  atom<UpdateCollectionFunction<UserSettings> | null>(null);
