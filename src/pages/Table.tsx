import { useEffect } from "react";
import { useLocation, useRouteMatch, Redirect } from "react-router-dom";
import queryString from "query-string";
import _isEmpty from "lodash/isEmpty";
import _find from "lodash/find";

import Navigation from "@src/components/Navigation";
import Breadcrumbs from "@src/components/Navigation/Breadcrumbs";
import Table from "@src/components/Table";
import SideDrawer from "@src/components/SideDrawer";
import TableHeaderSkeleton from "@src/components/Table/Skeleton/TableHeaderSkeleton";
import HeaderRowSkeleton from "@src/components/Table/Skeleton/HeaderRowSkeleton";
import EmptyTable from "@src/components/Table/EmptyTable";

import { useProjectContext } from "@src/contexts/ProjectContext";
import { useAppContext } from "@src/contexts/AppContext";
import { TableFilter } from "@src/hooks/useTable";
import { DocActions } from "@src/hooks/useDoc";
import ActionParamsProvider from "@src/components/fields/Action/FormDialog/Provider";
import { routes } from "constants/routes";

export default function TablePage() {
  const location = useLocation();
  const match = useRouteMatch<{ id: string }>();
  const urlPath = decodeURIComponent(match.params.id);
  const urlPathSplit = urlPath.split("/");

  const { tableState, tableActions, sideDrawerRef, tables } =
    useProjectContext();
  const { userDoc } = useAppContext();

  // Find the matching section for the current route
  const currentTableId = urlPathSplit[0];
  const currentSection = _find(tables, ["id", currentTableId])?.section;
  const table = _find(tables, ["id", currentTableId]);
  const tableName = table?.name || currentTableId;

  let filters: TableFilter[] = [];
  const parsed = queryString.parse(location.search);
  if (typeof parsed.filters === "string") {
    filters = JSON.parse(parsed.filters);
    // TODO: json schema validator
  }

  useEffect(() => {
    if (
      table &&
      tableActions &&
      tableState &&
      tableState.config.id !== urlPath
    ) {
      // Support multiple tables for top-level collection but unique sub-table configs
      const collection = [table.collection, ...urlPathSplit.slice(1)].join("/");

      tableActions.table.set(urlPath, collection, filters);
      if (filters && filters.length !== 0) {
        userDoc.dispatch({
          action: DocActions.update,
          data: { tables: { [urlPath]: { filters } } },
        });
      }
      if (sideDrawerRef?.current) sideDrawerRef.current.setCell!(null);
    }
  }, [urlPath, tableActions, tableState, table]);

  if (!tableState) return null;
  if (Array.isArray(tables) && tables.length > 0 && !table)
    return <Redirect to={routes.pageNotFound} />;

  return (
    <Navigation
      title={tableName}
      titleComponent={(open, pinned) => (
        <Breadcrumbs sx={{ ml: open && pinned ? -48 / 8 : 2 }} />
      )}
      currentSection={currentSection}
      titleTransitionProps={{ style: { transformOrigin: "0 50%" } }}
    >
      <ActionParamsProvider>
        {tableState.loadingColumns ? (
          <>
            <TableHeaderSkeleton />
            <HeaderRowSkeleton />
          </>
        ) : _isEmpty(tableState.columns) ? (
          <EmptyTable />
        ) : (
          <>
            <Table key={currentTableId} />
            <SideDrawer />
          </>
        )}
      </ActionParamsProvider>
    </Navigation>
  );
}
