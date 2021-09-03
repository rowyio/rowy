import { useEffect } from "react";
import queryString from "query-string";
import _isEmpty from "lodash/isEmpty";
import _find from "lodash/find";

import { Hidden } from "@material-ui/core";

import Navigation from "components/Navigation";
import Breadcrumbs from "components/Navigation/Breadcrumbs";
import Table from "components/Table";
import SideDrawer from "components/SideDrawer";
import TableHeaderSkeleton from "components/Table/Skeleton/TableHeaderSkeleton";
import HeaderRowSkeleton from "components/Table/Skeleton/HeaderRowSkeleton";
import EmptyTable from "components/Table/EmptyTable";

import { useRowyContext } from "contexts/RowyContext";
import { useAppContext } from "contexts/AppContext";
import { RowyFilter } from "hooks/useRowy";
import useRouter from "hooks/useRouter";
import { DocActions } from "hooks/useDoc";
import ActionParamsProvider from "components/fields/Action/FormDialog/Provider";

export default function TablePage() {
  const router = useRouter();
  const tableCollection = decodeURIComponent(router.match.params.id);

  const { tableState, tableActions, sideDrawerRef, tables } = useRowyContext();
  const { userDoc } = useAppContext();

  // Find the matching section for the current route
  const currentSection = _find(tables, [
    "collection",
    tableCollection?.split("/")[0],
  ])?.section;
  const currentTable = tableCollection?.split("/")[0];
  const tableName =
    _find(tables, ["collection", currentTable])?.name || currentTable;

  let filters: RowyFilter[] = [];
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
    <Navigation
      title={tableName}
      titleComponent={<Breadcrumbs />}
      currentSection={currentSection}
    >
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
