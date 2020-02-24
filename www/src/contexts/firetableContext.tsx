import React, { useState, useContext, useEffect } from "react";
import _groupBy from "lodash/groupBy";

import { Column } from "react-data-grid";
import { PopoverProps } from "@material-ui/core";
import firebase from "firebase/app";
import useFiretable, {
  FiretableActions,
  FiretableState,
} from "hooks/useFiretable";
import useSettings from "hooks/useSettings";
import { useAppContext } from "./appContext";

type SelectedColumnHeader = {
  column: Column<any> & { [key: string]: any };
  anchorEl: PopoverProps["anchorEl"];
};

interface FiretableContextProps {
  sections: {
    [sectionName: string]: {
      collection: string;
      name: string;
      roles: string[];
      description: string;
      regional: Boolean;
    }[];
  };
  tableState: FiretableState;
  tableActions: FiretableActions;
  updateCell: (
    ref: firebase.firestore.DocumentReference,
    fieldName: string,
    value: any
  ) => void;
  createTable: Function;
  selectedCell: { row: number; column: string };
  setSelectedCell: Function;
  userClaims: any;

  sideDrawerOpen: boolean;
  setSideDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;

  selectedColumnHeader: SelectedColumnHeader | null;
  setSelectedColumnHeader: React.Dispatch<
    React.SetStateAction<SelectedColumnHeader | null>
  >;
}

const firetableContext = React.createContext<Partial<FiretableContextProps>>(
  {}
);
export default firetableContext;

export const useFiretableContext = () => useContext(firetableContext);

export const FiretableContextProvider: React.FC = ({ children }) => {
  const { tableState, tableActions } = useFiretable();
  const [selectedCell, setSelectedCell] = useState<{
    row: number;
    column: string;
  }>();
  const [sections, setSections] = useState<any>();
  const [settings, createTable] = useSettings();
  const { tables } = settings;
  const [userRoles, setUserRoles] = useState<null | string[]>();
  const [userClaims, setUserClaims] = useState<any>();
  const [sideDrawerOpen, setSideDrawerOpen] = useState<boolean>(false);
  const [
    selectedColumnHeader,
    setSelectedColumnHeader,
  ] = useState<SelectedColumnHeader | null>(null);

  const { currentUser } = useAppContext();
  useEffect(() => {
    if (tables && userRoles && !sections) {
      const sections = _groupBy(
        tables.filter(
          table =>
            !table.roles || table.roles.some(role => userRoles.includes(role))
        ),
        "section"
      );
      setSections(sections);
    }
  }, [settings, tables, userRoles]);

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

  return (
    <firetableContext.Provider
      value={{
        tableState,
        tableActions,
        selectedCell,
        setSelectedCell,
        updateCell,
        createTable,
        sections,
        userClaims,
        sideDrawerOpen,
        setSideDrawerOpen,
        selectedColumnHeader,
        setSelectedColumnHeader,
      }}
    >
      {children}
    </firetableContext.Provider>
  );
};
