import { useEffect } from "react";
import useDoc, { DocActions } from "./useDoc";
import { db } from "../firebase";

const useSettings = () => {
  const [settingsState, documentDispatch] = useDoc({
    path: "_FIRETABLE_/settings",
  });
  useEffect(() => {
    //updates tables data on document change
    const { doc, tables } = settingsState;
    if (doc && tables !== doc.tables) {
      documentDispatch({ tables: doc.tables });
    }
  }, [settingsState]);

  const createTable = (name: string, collection: string) => {
    const { tables } = settingsState;
    // updates the setting doc
    if (tables) {
      documentDispatch({
        action: DocActions.update,
        data: { tables: [...tables, { name, collection }] },
      });
    } else {
      db.doc("_FIRETABLE_/settings").set(
        { tables: [{ name, collection }] },
        { merge: true }
      );
    }
    //create the firetable collection doc with empty columns
    db.collection(collection)
      .doc("_FIRETABLE_")
      .set({ columns: [] });
  };
  return [settingsState, createTable];
};

export default useSettings;
