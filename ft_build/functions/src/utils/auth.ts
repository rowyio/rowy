import * as functions from "firebase-functions";

export const hasAnyRole = (
  authorizedRoles: string[],
  context: functions.https.CallableContext
) => {
  if (!context.auth || !context.auth.token.roles) return false;
  const userRoles = context.auth.token.roles as string[];
  const authorization = authorizedRoles.reduce(
    (authorized: boolean, role: string) => {
      if (userRoles.includes(role)) return true;
      else return authorized;
    },
    false
  );
  return authorization;
};
