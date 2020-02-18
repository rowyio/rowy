import React, { useState, useContext, useEffect } from "react";
import _groupBy from "lodash/groupBy";

import useFiretable, {
  FiretableActions,
  FiretableState,
} from "hooks/useFiretable";
import useSettings from "hooks/useSettings";

import { useAppContext } from "./appContext";
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
  updateCell: Function;
  createTable: Function;
  selectedCell: { row: number; column: string };
  setSelectedCell: Function;
  userClaims: any;
}

const firetableContext = React.createContext<Partial<FiretableContextProps>>(
  {}
);
export default firetableContext;

export const useFiretableContext = () => useContext(firetableContext);

export const FiretableContextProvider: React.FC = ({ children }) => {
  const { tableState, tableActions } = useFiretable();
  console.log(tableState);
  const [selectedCell, setSelectedCell] = useState<{
    row: number;
    column: string;
  }>();
  const [sections, setSections] = useState<any>();
  const [settings, createTable] = useSettings();
  const { tables } = settings;
  const [userRoles, setUserRoles] = useState<null | string[]>();
  const [userClaims, setUserClaims] = useState<any>();

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

  const updateCell = (fieldName: string, row: any) => {};
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
      }}
    >
      {children}
    </firetableContext.Provider>
  );
};
