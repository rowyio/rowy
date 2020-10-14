import React, { useEffect } from "react";
import queryString from "query-string";
import { useFiretableContext } from "contexts/firetableContext";
import { useAppContext } from "contexts/appContext";

import { Hidden } from "@material-ui/core";

import Navigation from "components/Navigation";
import Table from "components/Table";
import SideDrawer from "components/SideDrawer";

import { FireTableFilter } from "hooks/useFiretable";
import useRouter from "hooks/useRouter";

import ImportWizard from "components/Wizards/ImportWizard";
import { DocActions } from "hooks/useDoc";
import ActionParamsProvider from "components/Table/formatters/Action/FormDialog/Provider";
export default function TableView() {
  const router = useRouter();
  const tableCollection = decodeURIComponent(router.match.params.id);
  const { tableState, tableActions, sideDrawerRef } = useFiretableContext();
  const { userDoc } = useAppContext();
  let filters: FireTableFilter[] = [];
  const parsed = queryString.parse(router.location.search);
  if (typeof parsed.filters === "string") {
    // decoded
    //[{"key":"cohort","operator":"==","value":"AMS1"}]
    filters = JSON.parse(parsed.filters);
    //TODO: json schema validator
  }

  useEffect(() => {
    if (
      tableActions &&
      tableState &&
      tableState.tablePath !== tableCollection
    ) {
      tableActions.table.set(tableCollection, filters);
      if (filters && filters.length !== 0) {
        userDoc.dispatch({
          action: DocActions.update,
          data: {
            tables: { [`${tableState?.tablePath}`]: { filters } },
          },
        });
      }
      if (sideDrawerRef?.current) sideDrawerRef.current.setCell!(null);
    }
  }, [tableCollection]);

  // if (!tableState?.tablePath) {
  //   console.error(tableState);
  //   throw new Error("tableState.tablePath is blank");
  // }

  return (
    <Navigation tableCollection={tableCollection}>
      <ActionParamsProvider>
        <Table key={tableCollection} />

        <ImportWizard />

        <Hidden smDown>
          <SideDrawer />
        </Hidden>
      </ActionParamsProvider>
    </Navigation>
  );
}
