import { useEffect } from "react";
import useDoc, { DocActions } from "./useDoc";

const useSettings = () => {
  const [settingsState, documentDispatch] = useDoc({
    path: "_FIRETABLE_/settings"
  });
  useEffect(() => {
    const { doc, tables } = settingsState;
    if (doc && tables !== doc.tables) {
      documentDispatch({ tables: doc.tables });
    }
  }, [settingsState]);

  const createTable = (name: string, collection: string) => {
    const { tables } = settingsState;
    documentDispatch({
      action: DocActions.update,
      data: { tables: [...tables, { name, collection }] }
    });
  };
  return [settingsState, createTable];
};

export default useSettings;
