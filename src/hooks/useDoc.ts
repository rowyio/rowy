import { db } from "../firebase";
import { useEffect, useReducer } from "react";

export enum DocActions {
  update,
  delete,
  clear,
}
const documentInitialState = {
  path: null,
  prevPath: null,
  doc: null,
  ref: null,
  loading: true,
  error: null,
};

const useDoc = (
  initialOverrides: any,
  options: { createIfMissing?: boolean } = {}
) => {
  const documentReducer = (prevState: any, newProps: any) => {
    switch (newProps.action) {
      case DocActions.clear:
        return documentInitialState;
      case DocActions.update:
        // takes data object form the dispatcher and updates doc

        (prevState.ref ? prevState.ref : db.doc(prevState.path))
          .set({ ...newProps.data }, { merge: true })
          .then(newProps.callback ? newProps.callback : () => {})
          .catch((error) => {
            console.log(error);
            documentDispatch({ error });
          });
        return { ...prevState, doc: { ...prevState.doc, ...newProps.data } };
      case DocActions.delete:
        prevState.ref.delete();
        return null;
      default:
        return { ...prevState, ...newProps };
    }
  };
  const [documentState, documentDispatch] = useReducer(documentReducer, {
    ...documentInitialState,
    ...initialOverrides,
  });

  const setDocumentListener = () => {
    documentDispatch({ prevPath: documentState.path });
    const unsubscribe = db.doc(documentState.path).onSnapshot(
      (snapshot) => {
        if (snapshot.exists) {
          const data = snapshot.data();
          const id = snapshot.id;
          const ref = snapshot.ref;
          const doc = { ...data, id, ref };
          documentDispatch({
            doc,
            ref,
            loading: false,
          });
        } else {
          if (options.createIfMissing)
            try {
              db.doc(documentState.path).set({}, { merge: true });
            } catch (e: any) {
              console.error(
                `Could not create ${documentState.path}`,
                e.message
              );
            }

          documentDispatch({ loading: false });
        }
      },
      (error) => {
        documentDispatch({
          loading: false,
          error,
        });
      }
    );
    documentDispatch({ unsubscribe });
  };
  useEffect(() => {
    const { path, prevPath, unsubscribe } = documentState;
    if (path && path !== prevPath) {
      if (unsubscribe) unsubscribe();
      setDocumentListener();
    }
  }, [documentState]);
  useEffect(
    () => () => {
      if (documentState.unsubscribe) documentState.unsubscribe();
    },
    []
  );
  return [documentState, documentDispatch];
};

export default useDoc;
