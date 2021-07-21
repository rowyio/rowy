import React, { useState, useContext, useEffect, useRef, useMemo } from "react";
import _groupBy from "lodash/groupBy";
import _sortBy from "lodash/sortBy";
import { DataGridHandle } from "react-data-grid";
import firebase from "firebase/app";
import useFiretable, {
  FiretableActions,
  FiretableState,
} from "hooks/useFiretable";
import useSettings from "hooks/useSettings";
import { useAppContext } from "./AppContext";
import { useSnackContext } from "./SnackContext";
import { SideDrawerRef } from "components/SideDrawer";
import { ColumnMenuRef } from "components/Table/ColumnMenu";
import { ImportWizardRef } from "components/Wizards/ImportWizard";
import _find from "lodash/find";
import { deepen } from "utils/fns";
export type Table = {
  collection: string;
  name: string;
  roles: string[];
  description: string;
  section: string;
  isCollectionGroup: boolean;
};

interface FiretableContextProps {
  tables: Table[];
  roles: string[];
  sections: { [sectionName: string]: Table[] };
  tableState: FiretableState;
  tableActions: FiretableActions;
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
      collection: string;
      name: string;
      description: string;
      roles: string[];
      section: string;
    }) => void;
    updateTable: (data: {
      collection: string;
      name: string;
      description: string;
      roles: string[];
      section: string;
    }) => Promise<any>;
    deleteTable: (collection: string) => void;
  };

  userClaims: any;

  // A ref to the data grid. Contains data grid functions
  dataGridRef: React.RefObject<DataGridHandle>;
  // A ref to the side drawer state. Prevents unnecessary re-renders
  sideDrawerRef: React.MutableRefObject<SideDrawerRef | undefined>;
  // A ref to the column menu. Prevents unnecessary re-renders
  columnMenuRef: React.MutableRefObject<ColumnMenuRef | undefined>;
  // A ref ot the import wizard. Prevents unnecessary re-renders
  importWizardRef: React.MutableRefObject<ImportWizardRef | undefined>;
}

const FiretableContext = React.createContext<Partial<FiretableContextProps>>(
  {}
);
export default FiretableContext;

export const firetableUser = (currentUser) => {
  const {
    displayName,
    email,
    uid,
    emailVerified,
    isAnonymous,
    photoURL,
  } = currentUser;
  return {
    timestamp: new Date(),
    displayName,
    email,
    uid,
    emailVerified,
    isAnonymous,
    photoURL,
  };
};
export const useFiretableContext = () => useContext(FiretableContext);

export const FiretableContextProvider: React.FC = ({ children }) => {
  const { open } = useSnackContext();
  const { tableState, tableActions } = useFiretable();
  const [tables, setTables] = useState<FiretableContextProps["tables"]>();
  const [sections, setSections] = useState<FiretableContextProps["sections"]>();
  const [settings, settingsActions] = useSettings();
  const [userRoles, setUserRoles] = useState<null | string[]>();
  const [userClaims, setUserClaims] = useState<any>();

  const { currentUser } = useAppContext();
  useEffect(() => {
    const { tables } = settings;
    if (tables && userRoles && !sections) {
      const filteredTables = _sortBy(tables, "name")
        .filter(
          (table) =>
            userRoles.includes("ADMIN") ||
            table.roles.some((role) => userRoles.includes(role))
        )
        .map((table) => ({
          ...table,
          section: table.section ? table.section.toUpperCase().trim() : "OTHER",
        }));

      const _sections = _groupBy(filteredTables, "section");
      setSections(_sections);
      setTables(filteredTables);
    }
  }, [settings, userRoles, sections]);

  const roles = useMemo(
    () =>
      Array.isArray(tables)
        ? Array.from(
            new Set(tables.reduce((a, c) => [...a, ...c.roles], [] as string[]))
          )
        : [],
    [tables]
  );

  useEffect(() => {
    if (currentUser && !userClaims) {
      currentUser.getIdTokenResult(true).then((results) => {
        setUserRoles(results.claims.roles || []);
        setUserClaims(results.claims);
      });
    }
  }, [currentUser]);

  const updateCell: FiretableContextProps["updateCell"] = (
    ref,
    fieldName,
    value,
    onSuccess
  ) => {
    if (value === undefined) return;
    const _ft_updatedBy = firetableUser(currentUser);
    const _ft_updatedAt = _ft_updatedBy.timestamp;

    const update = {
      ...deepen({ [fieldName]: value }),
      _ft_updatedAt,
      _ft_updatedBy,
    };
    tableActions.row.update(
      ref,
      update,
      () => {
        if (onSuccess) onSuccess(ref, fieldName, value);
      },
      (error) => {
        if (error.code === "permission-denied") {
          open({
            message: `You don't have permissions to make this change`,
            variant: "error",
            duration: 2000,
            position: { horizontal: "center", vertical: "top" },
          });
        }
      }
    );
  };

  // A ref to the data grid. Contains data grid functions
  const dataGridRef = useRef<DataGridHandle>(null);
  const sideDrawerRef = useRef<SideDrawerRef>();
  const columnMenuRef = useRef<ColumnMenuRef>();
  const importWizardRef = useRef<ImportWizardRef>();

  return (
    <FiretableContext.Provider
      value={{
        tableState,
        tableActions,
        updateCell,
        settingsActions,
        roles,
        tables,
        sections,
        userClaims,
        dataGridRef,
        sideDrawerRef,
        columnMenuRef,
        importWizardRef,
      }}
    >
      {children}
    </FiretableContext.Provider>
  );
};
