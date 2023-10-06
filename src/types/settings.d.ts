import { ThemeOptions } from "@mui/material";
import { TableSettings, TableFilter, TableRowRef, TableSort } from "./table";

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

/** Project settings are visible to authenticated users */
export type ProjectSettings = Partial<{
  tables: TableSettings[];

  setupCompleted: boolean;

  rowyRunUrl: string;
  rowyRunRegion: string;
  rowyRunDeployStatus: "BUILDING" | "COMPLETE";
  services: Partial<{
    hooks: string;
    builder: string;
    terminal: string;
  }>;
  exporterRoles?: string[];
}>;

/** User info and settings */
export type UserSettings = Partial<{
  _rowy_ref: TableRowRef;
  /** Synced from user auth info */
  user: {
    email: string;
    displayName?: string;
    photoURL?: string;
    phoneNumber?: string;
  };
  roles: string[];

  theme: Record<"base" | "light" | "dark", ThemeOptions>;

  favoriteTables: string[];
  /** Stores default user settings for all tables */
  defaultTableSettings: Partial<{
    saveSortsPopupDisabled: boolean;
    automaticallyApplySorts: boolean;
    saveColumnSizingPopupDisabled: boolean;
    automaticallyApplyColumnSizing: boolean;
  }>;
  /** Stores table-specific user overrides */
  tables: Record<
    string,
    Partial<{
      filters: TableFilter[];
      hiddenFields: string[];
      sorts: TableSort[];
      joinOperator: "AND" | "OR";
    }>
  >;

  /** Stores table tutorial completion */
  tableTutorialComplete?: boolean;
}>;
