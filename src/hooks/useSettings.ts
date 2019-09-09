import { db } from "../firebase";
import { useEffect, useReducer } from "react";

const documentReducer = (prevState: any, newProps: any) => {
  return { ...prevState, ...newProps };
};
const documentIntialState = {
  doc: null,
  loading: false
};

const useSettings = () => {
  const [settingsState, settingsDispatch] = useReducer(documentReducer, {
    ...documentIntialState
  });
  const setSettingsListner = () => {
    settingsDispatch({ loading: true });
    const unsubscribe = db.doc("_FIRETABLE_/settings").onSnapshot(snapshot => {
      if (snapshot.exists) {
        const data = snapshot.data();
        const doc = { tables: [], ...data };
        const tables = doc.tables;
        settingsDispatch({
          doc,
          tables,
          loading: false
        });
      }
    });
    settingsDispatch({ unsubscribe });
  };

  useEffect(() => {
    const { doc, loading } = settingsState;
    if (!doc && !loading) {
      //initialise listener
      setSettingsListner();
    }
  }, [settingsState]);
  useEffect(
    () => () => {
      if (settingsState.unsubscribe) settingsState.unsubscribe();
    },
    []
  );
  return [settingsState, settingsDispatch];
};

export default useSettings;
