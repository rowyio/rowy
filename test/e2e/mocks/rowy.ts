import { Timestamp } from "firebase-admin/firestore";

export const publicSettingsDoc = {
  signInOptions: ["google"],
};

export const settingsDoc = {
  cloudFunctionsRegion: "us-central1",
  tables: [
    {
      audit: true,
      auditFieldCreatedBy: "_createdBy",
      auditFieldUpdatedBy: "_updatedBy",
      collection: "allFieldTypes",
      description: "Explore all the different fields supported by Rowy",
      details:
        "Play around with all of Rowys different field types by changing values and turning things on/off",
      id: "allFieldTypes",
      name: "All Field Types",
      readOnly: false,
      roles: ["ADMIN", "EDITOR", "OWNER"],
      section: "Showcase feature 📲",
      tableType: "primaryCollection",
      thumbnailURL:
        "https://firebasestorage.googleapis.com/v0/b/tryrowy.appspot.com/o/__thumbnails__%2FallFieldTypes?alt=media&token=6766023d-e1ba-4248-bbf4-d228d1036507",
    },
  ],
  createdAt: Timestamp.now(),
};

export const userManagementDoc = {
  owner: {
    email: "owner@rowy.io",
  },
};
