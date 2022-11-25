// https://firebase.google.com/docs/firestore/quotas
export const REGEX_DOCUMENT_ID = /^(?!\.\.?$)(?!.*__.*__)([^/]{1,1500})$/;

export const isValidDocId = (documentId: string) =>
  REGEX_DOCUMENT_ID.test(documentId);
