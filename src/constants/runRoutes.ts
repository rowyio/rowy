export const runRepoUrl = "https://github.com/rowyio/rowyRun";

export type RunRoute = {
  path: string;
  method: "POST" | "GET";
};

type impersonateUserRequest = {
  path: "/impersonateUser";
  method: "GET";
  params: string[];
};

type ActionData = {
  ref: {
    id: string;
    path: string;
    parentId: string;
    tablePath: string;
  };
  schemaDocPath?: string;
  column: any;
  action: "run" | "redo" | "undo";
  actionParams: any;
};
type actionScriptRequest = {
  path: "/actionScript";
  method: "POST";
  body: ActionData;
};

type RunRoutes = actionScriptRequest | impersonateUserRequest;

export const RunRoutes: { [key: string]: RunRoute } = {
  impersonateUser: { path: "/impersonateUser", method: "GET" },
  version: { path: "/version", method: "GET" },
  region: { path: "/region", method: "GET" },
  firestoreRules: { path: "/firestoreRules", method: "GET" },
  listCollections: { path: "/listCollections", method: "GET" },
  serviceAccountAccess: { path: "/serviceAccountAccess", method: "GET" },
  checkFT2Rowy: { path: "/checkFT2Rowy", method: "GET" },
  migrateFT2Rowy: { path: "/migrateFT2Rowy", method: "GET" },
  actionScript: { path: "/actionScript", method: "POST" },
  buildFunction: { path: "/buildFunction", method: "POST" },
  projectOwner: { path: "/projectOwner", method: "GET" },
  setOwnerRoles: { path: "/setOwnerRoles", method: "GET" },
};
