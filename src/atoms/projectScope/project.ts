import { atom } from "jotai";
import { sortBy } from "lodash-es";

import { userRolesAtom } from "./auth";
import {
  PublicSettings,
  ProjectSettings,
  UserSettings,
} from "@src/types/settings";
import {
  UpdateDocFunction,
  UpdateCollectionDocFunction,
  TableSettings,
  TableSchema,
} from "@src/types/table";
import { FieldType } from "@src/constants/fields";
import { FunctionSettings } from "@src/types/function";

export const projectIdAtom = atom<string>("");

/** Public settings are visible to unauthenticated users */
export const publicSettingsAtom = atom<PublicSettings>({});
/** Stores a function that updates public settings */
export const updatePublicSettingsAtom = atom<
  UpdateDocFunction<PublicSettings> | undefined
>(undefined);

/** Project settings are visible to authenticated users */
export const projectSettingsAtom = atom<ProjectSettings>({});
/**
 * Stores a function that updates project settings
 *
 * @example Basic usage:
 * ```
 * const [updateProjectSettings] = useAtom(updateProjectSettingsAtom, projectScope);
 * if (updateProjectSettings) updateProjectSettings({ ... });
 * ```
 */
export const updateProjectSettingsAtom = atom<
  UpdateDocFunction<ProjectSettings> | undefined
>(undefined);

/** Tables visible to the signed-in user based on roles */
export const tablesAtom = atom<TableSettings[]>((get) => {
  const userRoles = get(userRolesAtom);
  const tables = get(projectSettingsAtom).tables || [];

  return sortBy(tables, "name")
    .filter((table) =>
      userRoles.includes("ADMIN") || Array.isArray(table.roles)
        ? table.roles?.some((role) => userRoles.includes(role))
        : false
    )
    .map((table) => ({
      ...table,
      // Ensure id exists for backwards compatibility
      id: table.id || table.collection,
      // Ensure section exists
      section: table.section ? table.section.trim() : "Other",
    }));
});

/**
 * Additional table settings that can be passed to write functions
 * but are not written to the settings document
 */
export type AdditionalTableSettings = Partial<{
  _schemaSource: string;
  _initialColumns: Record<FieldType, boolean>;
  _schema: TableSchema;
  _suggestedRules: string;
}>;

/** Stores a function to create a table with schema doc */
export const createTableAtom = atom<
  | ((
      settings: TableSettings,
      additionalSettings?: AdditionalTableSettings
    ) => Promise<void>)
  | undefined
>(undefined);

/**
 * Minimum amount of table settings required to be passed to updateTable to
 * idetify the table and schema doc
 */
export type MinimumTableSettings = {
  id: TableSettings["id"];
  tableType: TableSettings["tableType"];
} & Partial<TableSettings>;

/** Stores a function to update a table and its schema doc */
export const updateTableAtom = atom<
  | ((
      settings: MinimumTableSettings,
      additionalSettings?: AdditionalTableSettings
    ) => Promise<void>)
  | undefined
>(undefined);

/** Stores a function to delete a table and its schema doc */
export const deleteTableAtom = atom<
  ((id: string) => Promise<void>) | undefined
>(undefined);

/** Stores a function to get a table’s schema doc (without listener) */
export const getTableSchemaAtom = atom<
  ((id: string, withSubtables?: boolean) => Promise<TableSchema>) | undefined
>(undefined);

/** Roles used in the project based on table settings */
export const projectRolesAtom = atom((get) =>
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
export const updateUserAtom = atom<
  UpdateCollectionDocFunction<UserSettings> | undefined
>(undefined);

/** Functions home page: all functions */
export const FunctionsIndexAtom = atom<FunctionSettings[]>([]);
/** Stores a function that updates a user document */
export const updateFunctionAtom = atom<
  UpdateCollectionDocFunction<FunctionSettings> | undefined
>(undefined);

export interface ISecretNames {
  loading: boolean;
  secretNames: null | string[];
}

export const secretNamesAtom = atom<ISecretNames>({
  loading: true,
  secretNames: null,
});
export const updateSecretNamesAtom = atom<
  ((clearSecretNames?: boolean) => Promise<void>) | undefined
>(undefined);
