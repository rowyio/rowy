import Logo from "@src/assets/Logo";
import BreadcrumbsTableRoot from "@src/components/Table/BreadcrumbsTableRoot";
import { FadeProps } from "@mui/material";

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
  functions = "/functions",
  function = "/function",
  functionWithId = "/function/:id",

  table = "/table",
  tableWithId = "/table/:id",
  /** Nested route: `/table/:id/subTable/...` */
  subTable = "subTable",
  /** Nested route: `/table/:id/subTable/...` */
  subTableWithId = "subTable/:docPath/:subTableKey",
  /** @deprecated Redirects to /table */
  tableGroup = "/tableGroup",
  /** @deprecated Redirects to /table */
  tableGroupWithId = "/tableGroup/:id",

  settings = "/settings",
  userSettings = "/settings/user",
  projectSettings = "/settings/project",
  userManagement = "/settings/userManagement",
  debugSettings = "/settings/debug",

  test = "/test",
  themeTest = "/test/theme",
  rowyRunTest = "/test/rowyRunTest",
}

export const ROUTE_TITLES = {
  [ROUTES.tables]: {
    title: "Tables",
    titleComponent: (open, isPermanent) =>
      !(open && isPermanent) && (
        <Logo style={{ display: "block", margin: "0 auto" }} />
      ),
  },

  [ROUTES.table]: {
    title: "Table",
    titleComponent: (_open, _isPermanent) => <BreadcrumbsTableRoot />,
    titleTransitionProps: { style: { transformOrigin: "0 50%" } },
    leftAligned: true,
  },

  [ROUTES.settings]: "Settings",
  [ROUTES.userSettings]: "Settings",
  [ROUTES.projectSettings]: "Project Settings",
  [ROUTES.userManagement]: "User Management",
  [ROUTES.debugSettings]: "Debug",

  [ROUTES.test]: "Test",
  [ROUTES.themeTest]: "Theme Test",
  [ROUTES.rowyRunTest]: "Rowy Run Test",
} as Record<
  ROUTES,
  | string
  | {
      title: string;
      titleComponent: (open: boolean, isPermanent: boolean) => React.ReactNode;
      titleTransitionProps?: Partial<FadeProps>;
      leftAligned?: boolean;
    }
>;
