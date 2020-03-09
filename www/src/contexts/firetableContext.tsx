import React, { useState, useContext, useEffect, useRef } from "react";
import _groupBy from "lodash/groupBy";

import { Column, DataGridHandle } from "react-data-grid";
import { PopoverProps } from "@material-ui/core";
import firebase from "firebase/app";
import useFiretable, {
  FiretableActions,
  FiretableState,
} from "hooks/useFiretable";
import useSettings from "hooks/useSettings";
import { useAppContext } from "./appContext";
import { SideDrawerRef } from "components/SideDrawer";

type SelectedColumnHeader = {
  column: Column<any> & { [key: string]: any };
  anchorEl: PopoverProps["anchorEl"];
};

export type Table = {
  collection: string;
  name: string;
  roles: string[];
  description: string;
  regional: boolean;
  section: string;
};

interface FiretableContextProps {
  tables: Table[];
  sections: { [sectionName: string]: Table[] };
  tableState: FiretableState;
  tableActions: FiretableActions;
  updateCell: (
    ref: firebase.firestore.DocumentReference,
    fieldName: string,
    value: any
  ) => void;
  createTable: Function;
  userClaims: any;

  // TODO: Investigate if this can be moved out of this context
  selectedColumnHeader: SelectedColumnHeader | null;
  setSelectedColumnHeader: React.Dispatch<
    React.SetStateAction<SelectedColumnHeader | null>
  >;

  // A ref to the data grid. Contains data grid functions
  dataGridRef: React.RefObject<DataGridHandle>;
  // A ref to the side drawer state. Prevents unnecessary re-renders
  sideDrawerRef: React.MutableRefObject<SideDrawerRef | undefined>;
}

const firetableContext = React.createContext<Partial<FiretableContextProps>>(
  {}
);
export default firetableContext;

export const useFiretableContext = () => useContext(firetableContext);

export const FiretableContextProvider: React.FC = ({ children }) => {
  const { tableState, tableActions } = useFiretable();
  const [tables, setTables] = useState<FiretableContextProps["tables"]>();
  const [sections, setSections] = useState<FiretableContextProps["sections"]>();
  const [settings, createTable] = useSettings();
  const [userRoles, setUserRoles] = useState<null | string[]>();
  const [userClaims, setUserClaims] = useState<any>();
  const [
    selectedColumnHeader,
    setSelectedColumnHeader,
  ] = useState<SelectedColumnHeader | null>(null);

  const { currentUser } = useAppContext();
  useEffect(() => {
    const { tables } = settings;
    if (tables && userRoles && !sections) {
      const filteredTables = tables.filter(
        table =>
          !table.roles || table.roles.some(role => userRoles.includes(role))
      );

      const sections = _groupBy(filteredTables, "section");

      setSections(sections);
      setTables(filteredTables);
    }
  }, [settings, userRoles]);

  useEffect(() => {
    if (currentUser && !userClaims) {
      currentUser.getIdTokenResult(true).then(results => {
        setUserRoles(results.claims.roles || []);
        setUserClaims(results.claims);
        // setUserRegions(results.claims.regions || []);
      });
    }
  }, [currentUser]);

  const updateCell = (
    ref: firebase.firestore.DocumentReference,
    fieldName: string,
    value: any
  ) => {
    if (value === null || value === undefined) return;
    const _ft_updatedAt = new Date();
    const _ft_updatedBy = currentUser?.uid ?? "";

    ref.update({
      [fieldName]: value,
      _ft_updatedAt,
      updatedAt: _ft_updatedAt,
      _ft_updatedBy,
      updatedBy: _ft_updatedBy,
    });
  };

  // A ref to the data grid. Contains data grid functions
  const dataGridRef = useRef<DataGridHandle>(null);
  const sideDrawerRef = useRef<SideDrawerRef>();

  return (
    <firetableContext.Provider
      value={{
        tableState,
        tableActions,
        updateCell,
        createTable,
        tables,
        sections,
        userClaims,
        selectedColumnHeader,
        setSelectedColumnHeader,
        dataGridRef,
        sideDrawerRef,
      }}
    >
      {children}
    </firetableContext.Provider>
  );
};
