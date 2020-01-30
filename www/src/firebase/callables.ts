import { functions } from "./index";
import { FireTableFilter } from "../hooks/useFiretable";

export enum CLOUD_FUNCTIONS {
  updateAlgoliaRecord = "updateAlgoliaRecord",
  deleteAlgoliaRecord = "deleteAlgoliaRecord",
  exportTable = "exportTable",
}

export const cloudFunction = (
  name: string,
  input: any,
  success: Function,
  fail: Function
) => {
  const callable = functions.httpsCallable(name);
  callable(input)
    .then(result => {
      if (success) {
        success(result);
      }
    })
    .catch(error => {
      if (fail) {
        fail(error);
      }
    });
};

// TODO: data formating dates,
export const algoliaUpdateDoc = (data: {
  collection: string;
  id: string;
  doc: any;
}) => functions.httpsCallable(CLOUD_FUNCTIONS.updateAlgoliaRecord)(data);

export const algoliaDeleteDoc = functions.httpsCallable(
  CLOUD_FUNCTIONS.deleteAlgoliaRecord
);

export const exportTable = (data: {
  collectionPath: string;
  filters: FireTableFilter[];
  columns: any[];
  allFields: Boolean;
}) => functions.httpsCallable(CLOUD_FUNCTIONS.exportTable)(data);
