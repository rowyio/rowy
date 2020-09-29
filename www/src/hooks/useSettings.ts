import { useEffect } from "react";
import useDoc from "./useDoc";
import { db } from "../firebase";

const useSettings = () => {
  const [settingsState, documentDispatch] = useDoc({
    path: "_FIRETABLE_/settings",
  });
  useEffect(() => {
    //updates tables data on document change
    const { doc, tables } = settingsState;
    if (doc && tables !== doc.tables) {
      // const sections = _groupBy(
      //   tables.filter(
      //     table =>
      //       !table.roles || table.roles.some(role => userRoles.includes(role))
      //   ),
      //   "section"
      // );
      documentDispatch({ tables: doc.tables, roles: doc.roles });
    }
  }, [settingsState]);

  const createTable = (data: {
    name: string;
    collection: string;
    description: string;
    roles: string[];
  }) => {
    const { tables } = settingsState;
    // updates the setting doc

    db.doc("_FIRETABLE_/settings").set(
      { tables: tables ? [...tables, data] : [data] },
      { merge: true }
    );

    //create the firetable collection doc with empty columns
    db.collection("_FIRETABLE_/settings/schema")
      .doc(data.collection)
      .set({ ...data, columns: {} }, { merge: true });
  };

  const updateTable = (data: {
    name: string;
    collection: string;
    description: string;
    roles: string[];
  }) => {
    const { tables } = settingsState;
    const table = tables.filter((t) => t.collection === data.collection)[0];
    return Promise.all([
      db.doc("_FIRETABLE_/settings").set(
        {
          tables: tables
            ? [
                ...tables.filter(
                  (table) => table.collection !== data.collection
                ),
                { table, ...data },
              ]
            : [data],
        },
        { merge: true }
      ),
      //update the firetable collection doc with empty columns
      db
        .collection("_FIRETABLE_/settings/schema")
        .doc(data.collection)
        .set({ ...data }, { merge: true }),
    ]);
  };
  const deleteTable = (collection: string) => {
    const { tables } = settingsState;

    db.doc("_FIRETABLE_/settings").update({
      tables: tables.filter((table) => table.collection !== collection),
    });
    db.collection("_FIRETABLE_/settings/schema").doc(collection).delete();
  };
  const settingsActions = { createTable, updateTable, deleteTable };
  return [settingsState, settingsActions];
};

export default useSettings;
