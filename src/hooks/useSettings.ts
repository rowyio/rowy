import { useEffect } from "react";
import useDoc from "./useDoc";
import { db } from "../firebase";
import { SETTINGS, TABLE_GROUP_SCHEMAS, TABLE_SCHEMAS } from "config/dbPaths";

const useSettings = () => {
  const [settingsState, documentDispatch] = useDoc({ path: SETTINGS });
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

  const createTable = async (data: {
    name: string;
    collection: string;
    description: string;
    tableType: string;
    roles: string[];
    schemaSource: any;
  }) => {
    const { tables } = settingsState;
    const { schemaSource, ...tableSettings } = data;
    const tableSchemaPath = `${
      tableSettings.tableType !== "collectionGroup"
        ? TABLE_SCHEMAS
        : TABLE_GROUP_SCHEMAS
    }/${tableSettings.collection}`;
    const tableSchemaDocRef = db.doc(tableSchemaPath);

    let columns = {};
    if (schemaSource) {
      const schemaSourcePath = `${
        tableSettings.tableType !== "collectionGroup"
          ? TABLE_SCHEMAS
          : TABLE_GROUP_SCHEMAS
      }/${schemaSource.collection}`;
      const sourceDoc = await db.doc(schemaSourcePath).get();
      columns = sourceDoc.get("columns");
    }
    // updates the setting doc
    await db
      .doc(SETTINGS)
      .set(
        { tables: tables ? [...tables, tableSettings] : [tableSettings] },
        { merge: true }
      );

    //create the rowy collection doc with empty columns
    await tableSchemaDocRef.set({ ...tableSettings, columns }, { merge: true });
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
      db.doc(SETTINGS).set(
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
      //update the rowy collection doc with empty columns
      db
        .collection(TABLE_SCHEMAS)
        .doc(data.collection)
        .set({ ...data }, { merge: true }),
    ]);
  };
  const deleteTable = (collection: string) => {
    const { tables } = settingsState;

    db.doc(SETTINGS).update({
      tables: tables.filter((table) => table.collection !== collection),
    });
    db.collection(TABLE_SCHEMAS).doc(collection).delete();
  };
  const settingsActions = { createTable, updateTable, deleteTable };
  return [settingsState, settingsActions];
};

export default useSettings;
