export enum routes {
  home = "/",
  projectSettings = "/?modal=settings",
  auth = "/auth",
  impersonatorAuth = "/impersonatorAuth",
  jwtAuth = "/jwtAuth",
  signOut = "/signOut",
  authSetup = "/authSetup",

  table = "/table",
  tableGroup = "/tableGroup",

  tableWithId = "/table/:id",
  tableGroupWithId = "/tableGroup/:id",
  grid = "/grid",
  gridWithId = "/grid/:id",
  editor = "/editor",

  settings = "/settings",
  userSettings = "/settings/user",
  // projectSettings = "/settings/project",
}

export default routes;
