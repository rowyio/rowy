import { useEffect, useCallback } from "react";
import { useAtom, useSetAtom } from "jotai";
import { useAtomCallback } from "jotai/utils";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { camelCase, find, findIndex, isEmpty } from "lodash-es";

import {
  projectScope,
  projectSettingsAtom,
  createTableAtom,
  updateTableAtom,
  deleteTableAtom,
  getTableSchemaAtom,
  AdditionalTableSettings,
  MinimumTableSettings,
  currentUserAtom,
} from "@src/atoms/projectScope";
import { firebaseDbAtom } from "./init";

import {
  SETTINGS,
  TABLE_SCHEMAS,
  TABLE_GROUP_SCHEMAS,
} from "@src/config/dbPaths";
import { rowyUser } from "@src/utils/table";
import { TableSettings, TableSchema } from "@src/types/table";
import { FieldType } from "@src/constants/fields";
import { getFieldProp } from "@src/components/fields";

export function useTableFunctions() {
  const [firebaseDb] = useAtom(firebaseDbAtom, projectScope);
  const [currentUser] = useAtom(currentUserAtom, projectScope);

  // Create a function to get the latest tables from project settings,
  // so we don’t create new functions when tables change
  const readTables = useAtomCallback(
    useCallback((get) => get(projectSettingsAtom).tables, []),
    projectScope
  );

  // Set the createTable function
  const setCreateTable = useSetAtom(createTableAtom, projectScope);
  useEffect(() => {
    setCreateTable(
      () =>
        async (
          settings: TableSettings,
          additionalSettings?: AdditionalTableSettings
        ) => {
          const {
            _schemaSource,
            _initialColumns = {},
            _schema,
          } = additionalSettings || {};

          // Get latest tables
          const tables = (await readTables()) || [];

          // Get columns from imported table settings or _schemaSource if provided
          let columns: NonNullable<TableSchema["columns"]> =
            Array.isArray(_schema?.columns) || !_schema?.columns
              ? {}
              : _schema?.columns;

          // If _schemaSource is provided, get the schema doc for that table
          if (_schemaSource) {
            const sourceTable = find(tables, ["id", _schemaSource]);

            if (sourceTable) {
              const sourceDocRef = doc(
                firebaseDb,
                sourceTable.tableType !== "collectionGroup"
                  ? TABLE_SCHEMAS
                  : TABLE_GROUP_SCHEMAS,
                _schemaSource
              );
              const sourceDoc = await getDoc(sourceDocRef);
              columns = sourceDoc.get("columns") || {};
            }
          }

          // Add columns from `_initialColumns`
          for (const [type, checked] of Object.entries(_initialColumns)) {
            if (
              checked &&
              // Make sure we don’t have
              !Object.values(columns).some((column) => column.type === type)
            )
              columns["_" + camelCase(type)] = {
                type,
                name: getFieldProp("name", type as FieldType),
                key: "_" + camelCase(type),
                fieldName: "_" + camelCase(type),
                config: {},
                index: Object.values(columns).length,
              };
          }

          const _createdBy = currentUser && rowyUser(currentUser);
          // Appends table to settings doc
          const promiseUpdateSettings = setDoc(
            doc(firebaseDb, SETTINGS),
            { tables: [...tables, { ...settings, _createdBy }] },
            { merge: true }
          );

          // Creates schema doc with columns
          const { functionConfigPath, functionBuilderRef, ...schemaToWrite } =
            _schema ?? {};
          const tableSchemaDocRef = doc(
            firebaseDb,
            settings.tableType !== "collectionGroup"
              ? TABLE_SCHEMAS
              : TABLE_GROUP_SCHEMAS,
            settings.id
          );
          const promiseAddSchema = await setDoc(
            tableSchemaDocRef,
            { ...schemaToWrite, columns },
            { merge: true }
          );

          // Wait for both to complete
          await Promise.all([promiseUpdateSettings, promiseAddSchema]);
        }
    );
  }, [currentUser, firebaseDb, readTables, setCreateTable]);

  // Set the createTable function
  const setUpdateTable = useSetAtom(updateTableAtom, projectScope);
  useEffect(() => {
    setUpdateTable(
      () =>
        async (
          settings: MinimumTableSettings,
          additionalSettings?: AdditionalTableSettings
        ) => {
          const { _schema } = additionalSettings || {};

          // Get latest tables
          const tables = [...((await readTables()) || [])];
          const foundIndex = findIndex(tables, ["id", settings.id]);
          const tableIndex = foundIndex > -1 ? foundIndex : tables.length;

          // Shallow merge new settings with old
          tables[tableIndex] = { ...tables[tableIndex], ...settings };

          // Updates settings doc with new tables array
          const promiseUpdateSettings = setDoc(
            doc(firebaseDb, SETTINGS),
            { tables },
            { merge: true }
          );

          // Updates schema doc if param is provided
          const { functionConfigPath, functionBuilderRef, ...schemaToWrite } =
            _schema ?? {};
          const tableSchemaDocRef = doc(
            firebaseDb,
            settings.tableType !== "collectionGroup"
              ? TABLE_SCHEMAS
              : TABLE_GROUP_SCHEMAS,
            settings.id
          );
          const promiseUpdateSchema = isEmpty(schemaToWrite)
            ? Promise.resolve()
            : await setDoc(tableSchemaDocRef, schemaToWrite, { merge: true });

          // Wait for both to complete
          await Promise.all([promiseUpdateSettings, promiseUpdateSchema]);
        }
    );
  }, [firebaseDb, readTables, setUpdateTable]);

  // Set the deleteTable function
  const setDeleteTable = useSetAtom(deleteTableAtom, projectScope);
  useEffect(() => {
    setDeleteTable(() => async (id: string) => {
      // Get latest tables
      const tables = (await readTables()) || [];
      const table = find(tables, ["id", id]);

      // Removes table from settings doc array
      const promiseUpdateSettings = setDoc(
        doc(firebaseDb, SETTINGS),
        { tables: tables.filter((table) => table.id !== id) },
        { merge: true }
      );

      // Deletes table schema doc
      const tableSchemaDocRef = doc(
        firebaseDb,
        table?.tableType === "collectionGroup"
          ? TABLE_GROUP_SCHEMAS
          : TABLE_SCHEMAS,
        id
      );
      const promiseDeleteSchema = deleteDoc(tableSchemaDocRef);

      // Wait for both to complete
      await Promise.all([promiseUpdateSettings, promiseDeleteSchema]);
    });
  }, [firebaseDb, readTables, setDeleteTable]);

  // Set the getTableSchema function
  const setGetTableSchema = useSetAtom(getTableSchemaAtom, projectScope);
  useEffect(() => {
    setGetTableSchema(() => async (id: string) => {
      // Get latest tables
      const tables = (await readTables()) || [];
      const table = find(tables, ["id", id]);

      const tableSchemaDocRef = doc(
        firebaseDb,
        table?.tableType === "collectionGroup"
          ? TABLE_GROUP_SCHEMAS
          : TABLE_SCHEMAS,
        id
      );
      return getDoc(tableSchemaDocRef).then(
        (doc) => (doc.data() || {}) as TableSchema
      );
    });
  }, [firebaseDb, readTables, setGetTableSchema]);
}
