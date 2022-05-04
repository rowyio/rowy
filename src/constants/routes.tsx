import Logo from "@src/assets/Logo";
import { GrowProps } from "@mui/material";

export enum ROUTES {
  home = "/",

  auth = "/auth",
  impersonatorAuth = "/impersonatorAuth",
  jwtAuth = "/jwtAuth",
  signOut = "/signOut",
  signUp = "/signUp",

  authSetup = "/authSetup",
  setup = "/setup",
  pageNotFound = "/404",

  tables = "/tables",
  automations = "/automations",

  table = "/table",
  tableWithId = "/table/:id",
  tableGroup = "/tableGroup",
  tableGroupWithId = "/tableGroup/:id",

  settings = "/settings",
  userSettings = "/settings/user",
  projectSettings = "/settings/project",
  userManagement = "/settings/userManagement",
  rowyRunTest = "/rrTest",
}

export const ROUTE_TITLES = {
  [ROUTES.tables]: {
    title: "Tables",
    titleComponent: (open, pinned) =>
      !(open && pinned) && (
        <Logo
          style={{
            display: "block",
            margin: "0 auto",
          }}
        />
      ),
  },

  [ROUTES.table]: "Table Test",

  [ROUTES.settings]: "Settings",
  [ROUTES.userSettings]: "Settings",
  [ROUTES.projectSettings]: "Project Settings",
  [ROUTES.userManagement]: "User Management",
  [ROUTES.rowyRunTest]: "Rowy Run Test",
} as Record<
  ROUTES,
  | string
  | {
      title: string;
      titleComponent: (open: boolean, pinned: boolean) => React.ReactNode;
      titleTransitionProps?: Partial<GrowProps>;
    }
>;
