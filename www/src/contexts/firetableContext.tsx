import React, { useState, useContext, useEffect } from "react";
import useFiretable, {
  FiretableActions,
  FiretableState,
} from "../hooks/useFiretable";
import { useAppContext } from "./appContext";
import useSettings from "../hooks/useSettings";
import _groupBy from "lodash/groupBy";
interface FiretableContextProps {
  section: any;
  // sections: {
  //   sectionName: string;
  //   tables:
  //     | {
  //         collection: string;
  //         name: string;
  //         roles: string[];
  //         description: string;
  //       }[]
  //     | undefined;
  // };
  tableState: FiretableState;
  tableActions: FiretableActions;
  updateCell: Function;
  currentRow: number;
  currentColumn: { key: string; name: string; config: any };
  setRow: Function;
}

const firetableContext = React.createContext<Partial<FiretableContextProps>>(
  {}
);
export default firetableContext;
export const useFiretableContext = () => useContext(firetableContext);

export const FiretableContextProvider: React.FC = ({ children }) => {
  const { tableState, tableActions } = useFiretable();
  const [currentRow, setCurrentRow] = useState();
  const [sections, setSections] = useState<any>();
  const [settings, createTable] = useSettings();
  const { tables } = settings;
  const [userRoles, setUserRoles] = useState<null | string[]>();
  //const [userRegions, setUserRegions] = useState<null | string[]>();

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
  }, [settings, userRoles]);

  useEffect(() => {
    if (currentUser) {
      currentUser.getIdTokenResult(true).then(results => {
        setUserRoles(results.claims.roles || []);
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
        currentRow,
        setRow: setCurrentRow,
        updateCell,
      }}
    >
      {children}
    </firetableContext.Provider>
  );
};

//
