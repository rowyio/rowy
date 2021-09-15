export enum routes {
  home = "/",
  auth = "/auth",
  impersonatorAuth = "/impersonatorAuth",
  jwtAuth = "/jwtAuth",
  signOut = "/signOut",
  authSetup = "/authSetup",
  setup = "/setup",

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

export default routes;
