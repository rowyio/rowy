export default [
  {
    fieldName: "team",
    eval: (db) => async ({ row, ref }) => {
      if (row.portfolio && row.portfolio[0]) {
        return {
          ...row.portfolio[0],
          docPath: row.portfolio[0].docPath.replace("portfolio", "myTeam"),
        };
      }
    },
    listenerFields: ["portfolio"],
  },
];
export const collectionPath =
  "founders-reonboarding/{founders_reonboardingDocId}/invites";
export const functionName = collectionPath
  .replace("-", "_")
  .replace(/\//g, "_")
  .replace(/_{.*?}_/g, "_");
