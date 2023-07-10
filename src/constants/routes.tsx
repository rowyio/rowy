import Logo from "@src/assets/Logo";
import BreadcrumbsTableRoot from "@src/components/Table/Breadcrumbs/BreadcrumbsTableRoot";
import { FadeProps, Typography } from "@mui/material";

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

  table = "/table",
  tableWithId = "/table/:id",
  /** Nested route: `/table/:id/subTable/...` */
  subTable = "subTable",
  arraySubTable = "arraySubTable",
  /** Nested route: `/table/:id/subTable/...` */
  subTableWithId = "subTable/:docPath/:subTableKey",
  arraySubTableWithId = "arraySubTable/:docPath/:subTableKey",
  /** @deprecated Redirects to /table */
  tableGroup = "/tableGroup",
  /** @deprecated Redirects to /table */
  tableGroupWithId = "/tableGroup/:id",

  settings = "/settings",
  userSettings = "/settings/user",
  projectSettings = "/settings/project",
  members = "/members",
  debug = "/debug",

  tutorial = "/tutorial",
  tableTutorial = "/tutorial/table",
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
  [ROUTES.members]: "Members",
  [ROUTES.debug]: "Debug",

  [ROUTES.tutorial]: "Tutorial",
  [ROUTES.tableTutorial]: {
    title: "Tutorial",
    titleComponent: (_o, _i) => (
      <Typography component="h1" variant="h6">
        Tutorial
      </Typography>
    ),
    titleTransitionProps: { style: { transformOrigin: "0 50%" } },
    leftAligned: true,
  },
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
