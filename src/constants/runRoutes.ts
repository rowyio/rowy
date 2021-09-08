export type RunRoute = {
  path: string;
  method: "POST" | "GET";
};
export const RunRoutes: { [key: string]: RunRoute } = {
  impersonateUser: { path: "/impersonateUser", method: "GET" },
  version: { path: "/version", method: "GET" },
  listCollections: { path: "/listCollections", method: "GET" },
};
