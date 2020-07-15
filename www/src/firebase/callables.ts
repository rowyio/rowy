import { functions } from "./index";
import { FireTableFilter } from "../hooks/useFiretable";

export enum CLOUD_FUNCTIONS {
  ImpersonatorAuth = "callable-ImpersonatorAuth",
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

export const ImpersonatorAuth = (email: string) =>
  functions.httpsCallable(CLOUD_FUNCTIONS.ImpersonatorAuth)({ email });
