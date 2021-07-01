import { useEffect } from "react";
import queryString from "query-string";
import _isEmpty from "lodash/isEmpty";

import { Hidden } from "@material-ui/core";

import Navigation from "components/Navigation";
import Table from "components/Table";
import SideDrawer from "components/SideDrawer";
import TableHeaderSkeleton from "components/Table/Skeleton/TableHeaderSkeleton";
import HeaderRowSkeleton from "components/Table/Skeleton/HeaderRowSkeleton";
import EmptyTable from "components/Table/EmptyTable";

import { useFiretableContext } from "contexts/FiretableContext";
import { useAppContext } from "contexts/AppContext";
import { FireTableFilter } from "hooks/useFiretable";
import useRouter from "hooks/useRouter";
import { DocActions } from "hooks/useDoc";
import ActionParamsProvider from "components/fields/Action/FormDialog/Provider";

export default function TablePage() {
  const router = useRouter();
  const tableCollection = decodeURIComponent(router.match.params.id);

  const { tableState, tableActions, sideDrawerRef } = useFiretableContext();
  const { userDoc } = useAppContext();

  let filters: FireTableFilter[] = [];
  const parsed = queryString.parse(router.location.search);
  if (typeof parsed.filters === "string") {
    filters = JSON.parse(parsed.filters);
    // TODO: json schema validator
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
            tables: { [`${tableState.tablePath}`]: { filters } },
          },
        });
      }
      if (sideDrawerRef?.current) sideDrawerRef.current.setCell!(null);
    }
  }, [tableCollection]);

  if (!tableState) return null;

  return (
    <Navigation tableCollection={tableCollection}>
      <ActionParamsProvider>
        {tableState.loadingColumns && (
          <>
            <TableHeaderSkeleton />
            <HeaderRowSkeleton />
          </>
        )}

        {!tableState.loadingColumns && !_isEmpty(tableState.columns) && (
          <Table key={tableCollection} />
        )}

        {!tableState.loadingColumns && _isEmpty(tableState.columns) && (
          <EmptyTable />
        )}

        <Hidden smDown>
          <SideDrawer />
        </Hidden>
      </ActionParamsProvider>
    </Navigation>
  );
}
