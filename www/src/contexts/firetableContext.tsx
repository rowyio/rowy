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
import { useAppContext } from "./appContext";
import { useSnackContext } from "./snackContext";
import { SideDrawerRef } from "components/SideDrawer";
import { ColumnMenuRef } from "components/Table/ColumnMenu";

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
    value: any
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
}

const firetableContext = React.createContext<Partial<FiretableContextProps>>(
  {}
);
export default firetableContext;

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
export const useFiretableContext = () => useContext(firetableContext);

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
            !table.roles || table.roles.some((role) => userRoles.includes(role))
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

  const updateCell = (
    ref: firebase.firestore.DocumentReference,
    fieldName: string,
    value: any
  ) => {
    if (value === undefined) return;

    const ftUser = firetableUser(currentUser);
    const _ft_updatedAt = new Date();
    const _ft_updatedBy = ftUser;
    let update = { [fieldName]: value };
    ref
      .update({
        ...update,
        _ft_updatedAt,
        updatedAt: _ft_updatedAt,
        _ft_updatedBy,
        updatedBy: _ft_updatedBy,
      })
      .then(
        (success) => {
          console.log("successful update");
        },
        (error) => {
          if (error.code === "permission-denied") {
            open({
              message: `You don't have permissions to make this change`,
              severity: "error",
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

  return (
    <firetableContext.Provider
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
      }}
    >
      {children}
    </firetableContext.Provider>
  );
};
