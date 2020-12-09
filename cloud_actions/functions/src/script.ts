export const cloudActionScript = async ({
  row,
  db,
  ref,
  auth,
  utilFns,
  actionParams,
  context,
}: any) => {
  const claims = context.auth.token;
  return { message: `hi ${JSON.stringify(claims.name)}!`, success: true };
};
