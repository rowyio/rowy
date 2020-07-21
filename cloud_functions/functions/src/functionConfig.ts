export default {
  onUpdate: true,
  onCreate: false,
  source: "advisors",
  fieldsToSync: [
    "firstName",
    "lastName",
    "preferredName",
    "profilePhoto",
    "email",
    "location",
  ],
  target: "coaches",
};
export const collectionPath = "";
