import { DocumentReference } from "@google-cloud/firestore";

export const valueFormatter = (value: DocumentReference, operator: string) => {
  if (value && value.path) return value.path;
  return "";
};
