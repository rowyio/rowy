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
    _schema?: Record<string, any>;
  }) => {
    const { tables } = settingsState;
    const { schemaSource, _initialColumns, _schema, ...tableSettings } = data;
    const tableSchemaPath = `${
      tableSettings.tableType !== "collectionGroup"
        ? TABLE_SCHEMAS
        : TABLE_GROUP_SCHEMAS
    }/${tableSettings.id}`;
    const tableSchemaDocRef = db.doc(tableSchemaPath);

    // Get columns from imported table settings or schemaSource if provided
    let columns: Record<string, any> =
      Array.isArray(_schema?.columns) || !_schema?.columns
        ? {}
        : _schema?.columns;
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
    for (const [type, checked] of Object.entries(_initialColumns)) {
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
    const { functionConfigPath, functionBuilderRef, ..._schemaToWrite } =
      _schema ?? {};
    await tableSchemaDocRef.set(
      { ..._schemaToWrite, columns },
      { merge: true }
    );
  };

  const updateTable = async (data: {
    id: string;
    name?: string;
    collection?: string;
    section?: string;
    description?: string;
    roles?: string[];
    _schema?: Record<string, any>;
    [key: string]: any;
  }) => {
    const { tables } = settingsState;
    const newTables = Array.isArray(tables) ? [...tables] : [];
    const foundIndex = _findIndex(newTables, { id: data.id });
    const tableIndex = foundIndex > -1 ? foundIndex : tables.length;

    const { _initialColumns, _schema, ...dataToWrite } = data;
    newTables[tableIndex] = { ...newTables[tableIndex], ...dataToWrite };

    await db.doc(SETTINGS).set({ tables: newTables }, { merge: true });

    // Updates schema doc if present
    if (_schema) {
      const tableSchemaPath = `${
        data.tableType !== "collectionGroup"
          ? TABLE_SCHEMAS
          : TABLE_GROUP_SCHEMAS
      }/${data.id}`;

      const { functionConfigPath, functionBuilderRef, ..._schemaToWrite } =
        _schema ?? {};
      await db.doc(tableSchemaPath).update(_schemaToWrite);
    }
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
