import { functions } from "./index";

export enum CLOUD_FUNCTIONS {
  ImpersonatorAuth = "callable-ImpersonatorAuth",
  getAlgoliaSearchKey = "getAlgoliaSearchKey",
}

export const cloudFunction = (
  name: string,
  input: any,
  success?: Function,
  fail?: Function
) =>
  new Promise((resolve, reject) => {
    const callable = functions.httpsCallable(name);
    callable(input)
      .then((result) => {
        if (success) {
          resolve(success(result));
        }
      })
      .catch((error) => {
        if (fail) {
          reject(fail(error));
        }
      });
  });

export const ImpersonatorAuth = (email: string) =>
  functions.httpsCallable(CLOUD_FUNCTIONS.ImpersonatorAuth)({ email });

export const getAlgoliaSearchKey = (index: string) =>
  functions.httpsCallable(CLOUD_FUNCTIONS.getAlgoliaSearchKey)({ index });
