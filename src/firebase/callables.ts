import { functions } from "./index";

export enum CLOUD_FUNCTIONS {
  updateAlgoliaRecord = "updateAlgoliaRecord",
  deleteAlgoliaRecord = "deleteAlgoliaRecord",
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
