import { functions } from "./index";
import { FireTableFilter } from "../hooks/useFiretable";

export enum CLOUD_FUNCTIONS {
  exportTable = "exportTable",
}

export const cloudFunction = (
  name: string,
  input: any,
  success?: Function,
  fail?: Function
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

export const exportTable = (data: {
  collectionPath: string;
  filters: FireTableFilter[];
  columns: any[];
  allFields: Boolean;
}) => functions.httpsCallable(CLOUD_FUNCTIONS.exportTable)(data);
