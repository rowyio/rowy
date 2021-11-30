import { useEffect } from "react";
import _findIndex from "lodash/findIndex";
import _camelCase from "lodash/camelCase";

import useDoc from "./useDoc";
import { db } from "../firebase";
import {
  SETTINGS,
  TABLE_GROUP_SCHEMAS,
  TABLE_SCHEMAS,
} from "@src/config/dbPaths";
import { FieldType } from "@src/constants/fields";
import { getFieldProp } from "@src/components/fields";

export default function useSettings() {
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
    id: string;
    name: string;
    collection: string;
    description: string;
    tableType: string;
    roles: string[];
    schemaSource: any;
    _initialColumns: Record<FieldType, boolean>;
  }) => {
    const { tables } = settingsState;
    const { schemaSource, ...tableSettings } = data;
    const tableSchemaPath = `${
      tableSettings.tableType !== "collectionGroup"
        ? TABLE_SCHEMAS
        : TABLE_GROUP_SCHEMAS
    }/${tableSettings.id}`;
    const tableSchemaDocRef = db.doc(tableSchemaPath);

    // Get columns from schemaSource if provided
    let columns: Record<string, any> = {};
    if (schemaSource) {
      const schemaSourcePath = `${
        tableSettings.tableType !== "collectionGroup"
          ? TABLE_SCHEMAS
          : TABLE_GROUP_SCHEMAS
      }/${schemaSource.id}`;
      const sourceDoc = await db.doc(schemaSourcePath).get();
      columns = sourceDoc.get("columns");
    }
    // Add columns from `_initialColumns`
    for (const [type, checked] of Object.entries(data._initialColumns)) {
      if (
        checked &&
        !Object.values(columns).some((column) => column.type === type)
      )
        columns["_" + _camelCase(type)] = {
          type,
          name: getFieldProp("name", type as FieldType),
          key: "_" + _camelCase(type),
          fieldName: "_" + _camelCase(type),
          config: {},
          index: Object.values(columns).length,
        };
    }

    // Appends table to settings doc
    await db.doc(SETTINGS).set(
      {
        tables: Array.isArray(tables)
          ? [...tables, tableSettings]
          : [tableSettings],
      },
      { merge: true }
    );

    // Creates schema doc with columns
    await tableSchemaDocRef.set({ columns }, { merge: true });
  };

  const updateTable = async (data: {
    id: string;
    name?: string;
    collection?: string;
    section?: string;
    description?: string;
    roles?: string[];
    [key: string]: any;
  }) => {
    const { tables } = settingsState;
    const newTables = Array.isArray(tables) ? [...tables] : [];
    const foundIndex = _findIndex(newTables, { id: data.id });
    const tableIndex = foundIndex > -1 ? foundIndex : tables.length;
    newTables[tableIndex] = { ...newTables[tableIndex], ...data };

    await db.doc(SETTINGS).set({ tables: newTables }, { merge: true });
  };

  const deleteTable = (id: string) => {
    const { tables } = settingsState;

    db.doc(SETTINGS).update({
      tables: tables.filter((table) => table.id !== id),
    });
    db.collection(TABLE_SCHEMAS).doc(id).delete();
  };
  const settingsActions = { createTable, updateTable, deleteTable };
  return [settingsState, settingsActions];
}
