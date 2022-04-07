import React, { useState, useContext, useEffect, useRef, useMemo } from "react";
import { useSnackbar } from "notistack";
import { DataGridHandle } from "react-data-grid";
import _sortBy from "lodash/sortBy";
import _find from "lodash/find";
import firebase from "firebase/app";
import { compare } from "compare-versions";

import useTable, { TableActions, TableState } from "@src/hooks/useTable";
import useSettings from "@src/hooks/useSettings";
import { useAppContext } from "./AppContext";
import { SideDrawerRef } from "@src/components/SideDrawer";
import { ColumnMenuRef } from "@src/components/Table/ColumnMenu";
import { ImportWizardRef } from "@src/components/Wizards/ImportWizard";

import { rowyRun, IRowyRunRequestProps } from "@src/utils/rowyRun";
import { rowyUser } from "@src/utils/fns";
import { runRoutes } from "@src/constants/runRoutes";
import { DocumentReference } from "@google-cloud/firestore";

export type Table = {
  id: string;
  collection: string;
  name: string;
  roles: string[];
  description: string;
  section: string;
  tableType: "primaryCollection" | "collectionGroup";
  audit?: boolean;
  auditFieldCreatedBy?: string;
  auditFieldUpdatedBy?: string;
  readOnly?: boolean;
};

interface IRowyRun
  extends Omit<IRowyRunRequestProps, "serviceUrl" | "authToken"> {
  service?: "hooks" | "builder";
}
export interface IProjectContext {
  settings: {
    rowyRunUrl?: string;
    services?: {
      hooks?: string;
    };
  };
  tables: Table[];
  table: Table;
  roles: string[];
  tableState: TableState;
  tableActions: TableActions;
  addRow: (
    data?: Record<string, any>,
    ignoreRequiredFields?: boolean,
    id?: string | { type: "smaller" }
  ) => void;
  addRows: (
    rows: { data?: Record<string, any>; id?: string }[],
    ignoreRequiredFields?: boolean
  ) => void;
  deleteRow: (rowId) => void;
  deleteCell: (
    rowRef: firebase.firestore.DocumentReference,
    fieldValue: string
  ) => void;
  updateCell: (
    ref: firebase.firestore.DocumentReference,
    fieldName: string,
    value: any,
    onSuccess?: (
      ref: firebase.firestore.DocumentReference,
      fieldName: string,
      value: any
    ) => void
  ) => void;
  settingsActions: {
    createTable: (data: {
      id: string;
      collection: string;
      name: string;
      description: string;
      roles: string[];
      section: string;
    }) => Promise<void>;
    updateTable: (data: {
      id: string;
      name?: string;
      collection?: string;
      section?: string;
      description?: string;
      roles?: string[];
      [key: string]: any;
    }) => Promise<any>;
    deleteTable: (id: string) => void;
  };

  compatibleRowyRunVersion: (args: {
    minVersion?: string;
    maxVersion?: string;
  }) => boolean;
  // A ref to the data grid. Contains data grid functions
  dataGridRef: React.RefObject<DataGridHandle>;
  // A ref to the side drawer state. Prevents unnecessary re-renders
  sideDrawerRef: React.MutableRefObject<SideDrawerRef | undefined>;
  // A ref to the column menu. Prevents unnecessary re-renders
  columnMenuRef: React.MutableRefObject<ColumnMenuRef | undefined>;
  // A ref ot the import wizard. Prevents unnecessary re-renders
  importWizardRef: React.MutableRefObject<ImportWizardRef | undefined>;

  rowyRun: <T = any>(args: IRowyRun) => Promise<T>;
}

const ProjectContext = React.createContext<Partial<IProjectContext>>({});
export default ProjectContext;

export const useProjectContext = () => useContext(ProjectContext);

export const ProjectContextProvider: React.FC = ({ children }) => {
  const { currentUser, userRoles, getAuthToken } = useAppContext();

  const { enqueueSnackbar } = useSnackbar();
  const { tableState, tableActions } = useTable();
  const [tables, setTables] = useState<IProjectContext["tables"]>();

  const [settings, settingsActions] = useSettings();
  const table = _find(tables, (table) => table.id === tableState.config.id);

  const [rowyRunVersion, setRowyRunVersion] = useState("");
  useEffect(() => {
    if (settings?.doc?.rowyRunUrl) {
      _rowyRun({
        route: runRoutes.version,
      }).then((resp) => {
        if (resp.version) setRowyRunVersion(resp.version);
      });
    }
  }, [settings?.doc?.rowyRunUrl]);

  useEffect(() => {
    const { tables } = settings;
    if (tables && userRoles) {
      const filteredTables = _sortBy(tables, "name")
        .filter(
          (table) =>
            userRoles.includes("ADMIN") ||
            table.roles.some((role) => userRoles.includes(role))
        )
        .map((table) => ({
          ...table,
          section: table.section ? table.section.trim() : "Other",
        }));

      setTables(
        filteredTables.map((table) => ({
          ...table,
          id: table.id || table.collection, // Ensure id exists
        }))
      );
    } else if (!settings.loading) {
      setTables([]);
    }
  }, [settings, userRoles]);

  const roles = useMemo(
    () =>
      Array.isArray(tables)
        ? Array.from(
            new Set(
              tables.reduce(
                (a, c) => [...a, ...c.roles],
                ["ADMIN", "EDITOR", "VIEWER"]
              )
            )
          )
        : [],
    [tables]
  );
  const auditChange = (
    type: "ADD_ROW" | "UPDATE_CELL" | "DELETE_ROW",
    rowId,
    data
  ) => {
    if (
      table?.audit !== false &&
      compatibleRowyRunVersion({ minVersion: "1.1.1" })
    ) {
      _rowyRun({
        route: runRoutes.auditChange,
        body: {
          rowyUser: rowyUser(currentUser!),
          type,
          ref: {
            rowPath: tableState.tablePath,
            rowId,
            tableId: table?.id,
            collectionPath: tableState.tablePath,
          },
          data,
        },
      });
    }
  };

  const addRow: IProjectContext["addRow"] = async (
    data,
    ignoreRequiredFields,
    id
  ) => {
    const valuesFromFilter = tableState.filters.reduce((acc, curr) => {
      if (curr.operator === "==") {
        return { ...acc, [curr.key]: curr.value };
      } else {
        return acc;
      }
    }, {});
    const initialData = Object.values(tableState.columns).reduce(
      (acc, column) => {
        if (column.config?.defaultValue?.type === "static") {
          return { ...acc, [column.key]: column.config.defaultValue.value };
        } else if (column.config?.defaultValue?.type === "null") {
          return { ...acc, [column.key]: null };
        } else {
          return acc;
        }
      },
      {}
    );

    const requiredFields = Object.values(tableState.columns)
      .filter((column) => column.config.required)
      .map((column) => column.key);

    if (table?.audit !== false) {
      initialData[table?.auditFieldCreatedBy || "_createdBy"] = rowyUser(
        currentUser!
      );
      initialData[table?.auditFieldUpdatedBy || "_updatedBy"] = rowyUser(
        currentUser!
      );
    }

    if (!(typeof id === "object" && id?.type === "smaller"))
      initialData._rowy_outOfOrder = true;

    await tableActions.row.add(
      { ...valuesFromFilter, ...initialData, ...data },
      ignoreRequiredFields ? [] : requiredFields,
      (rowId: string) => auditChange("ADD_ROW", rowId, {}),
      id
    );
    return;
  };

  const addRows = async (
    rows: { data?: any; id?: string }[],
    ignoreRequiredFields?: boolean
  ) => {
    const valuesFromFilter = tableState.filters.reduce((acc, curr) => {
      if (curr.operator === "==") {
        return { ...acc, [curr.key]: curr.value };
      } else {
        return acc;
      }
    }, {});
    const initialData = Object.values(tableState.columns).reduce(
      (acc, column) => {
        if (column.config?.defaultValue?.type === "static") {
          return { ...acc, [column.key]: column.config.defaultValue.value };
        } else if (column.config?.defaultValue?.type === "null") {
          return { ...acc, [column.key]: null };
        } else {
          return acc;
        }
      },
      {}
    );

    const requiredFields = Object.values(tableState.columns)
      .filter((column) => column.config.required)
      .map((column) => column.key);

    if (table?.audit !== false) {
      initialData[table?.auditFieldCreatedBy || "_createdBy"] = rowyUser(
        currentUser!
      );
      initialData[table?.auditFieldUpdatedBy || "_updatedBy"] = rowyUser(
        currentUser!
      );
    }

    await tableActions.addRows(
      rows.map((row) => ({
        data: { ...valuesFromFilter, ...initialData, ...row.data },
      })),
      ignoreRequiredFields ? [] : requiredFields,
      (rowId: string) => auditChange("ADD_ROW", rowId, {})
    );
    return;
  };

  const deleteCell: IProjectContext["deleteCell"] = (rowRef, fieldValue) => {
    rowRef
      .update({
        [fieldValue]: firebase.firestore.FieldValue.delete(),
      })
      .then(
        () => console.log("Field Value deleted"),
        (error) => {
          if (error.code === "permission-denied") {
            enqueueSnackbar(`You don't have permission to delete this field`, {
              variant: "error",
              anchorOrigin: { horizontal: "center", vertical: "top" },
            });
          } else {
            enqueueSnackbar(error.message, {
              variant: "error",
              anchorOrigin: { horizontal: "center", vertical: "top" },
            });
          }
        }
      );
  };

  const updateCell: IProjectContext["updateCell"] = (
    ref,
    fieldName,
    value,
    onSuccess
  ) => {
    if (value === undefined) return;
    const update = { [fieldName]: value };
    if (table?.audit !== false) {
      update[table?.auditFieldUpdatedBy || "_updatedBy"] = rowyUser(
        currentUser!,
        { updatedField: fieldName }
      );
    }
    tableActions.row.update(
      ref,
      update,
      () => {
        auditChange("UPDATE_CELL", ref.id, { updatedField: fieldName });
        if (onSuccess) onSuccess(ref, fieldName, value);
      },
      (error) => {
        if (error.code === "permission-denied") {
          enqueueSnackbar(
            `You do not have the permissions to make this change.`,
            {
              variant: "error",
              anchorOrigin: { horizontal: "center", vertical: "top" },
            }
          );
        } else {
          enqueueSnackbar(error.message, {
            variant: "error",
            anchorOrigin: { horizontal: "center", vertical: "top" },
          });
        }
      }
    );
  };

  const deleteRow = (ref: DocumentReference | DocumentReference[]) => {
    if (Array.isArray(ref)) {
      tableActions.row.delete(ref, () => {
        ref.forEach((r) => auditChange("DELETE_ROW", r.path, {}));
      });
    } else
      tableActions.row.delete(ref, () =>
        auditChange("DELETE_ROW", ref.path, {})
      );
  };

  // rowyRun access
  const _rowyRun: IProjectContext["rowyRun"] = async (args) => {
    const { service, ...rest } = args;
    const authToken = await getAuthToken();
    const serviceUrl = service
      ? settings.doc?.services[service]
      : settings.doc?.rowyRunUrl;

    if (serviceUrl) {
      return rowyRun({
        serviceUrl,
        authToken,
        ...rest,
      });
    } else {
      console.log("Rowy Run is not set up", args);
    }
  };

  const compatibleRowyRunVersion = ({
    minVersion,
    maxVersion,
  }: {
    minVersion?: string;
    maxVersion?: string;
  }) => {
    if (!rowyRunVersion) return false;
    if (minVersion && compare(rowyRunVersion, minVersion, "<")) return false;
    if (maxVersion && compare(rowyRunVersion, maxVersion, ">")) return false;
    return true;
  };

  // A ref to the data grid. Contains data grid functions
  const dataGridRef = useRef<DataGridHandle>(null);
  const sideDrawerRef = useRef<SideDrawerRef>();
  const columnMenuRef = useRef<ColumnMenuRef>();
  const importWizardRef = useRef<ImportWizardRef>();

  return (
    <ProjectContext.Provider
      value={{
        tableState,
        tableActions,
        addRow,
        addRows,
        deleteCell,
        updateCell,
        deleteRow,
        settingsActions,
        settings: settings.doc,
        roles,
        tables,
        table,
        dataGridRef,
        sideDrawerRef,
        columnMenuRef,
        importWizardRef,
        rowyRun: _rowyRun,
        compatibleRowyRunVersion,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};
