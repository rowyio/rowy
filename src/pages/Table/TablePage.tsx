import { useRef, Suspense, lazy } from "react";
import { useAtom } from "jotai";
import { DataGridHandle } from "react-data-grid";
import { ErrorBoundary } from "react-error-boundary";
import { isEmpty } from "lodash-es";

import { Fade } from "@mui/material";
import ErrorFallback, {
  InlineErrorFallback,
} from "@src/components/ErrorFallback";
import TableToolbarSkeleton from "@src/components/TableToolbar/TableToolbarSkeleton";
import HeaderRowSkeleton from "@src/components/Table/HeaderRowSkeleton";
import EmptyTable from "@src/components/Table/EmptyTable";
import TableToolbar from "@src/components/TableToolbar";
import Table from "@src/components/Table";
import SideDrawer from "@src/components/SideDrawer";
import ColumnMenu from "@src/components/ColumnMenu";
import ColumnModals from "@src/components/ColumnModals";
import TableModals from "@src/components/TableModals";

import {
  tableScope,
  tableSchemaAtom,
  columnModalAtom,
  tableModalAtom,
} from "@src/atoms/tableScope";
import useBeforeUnload from "@src/hooks/useBeforeUnload";
import ActionParamsProvider from "@src/components/fields/Action/FormDialog/Provider";
import { useSnackLogContext } from "@src/contexts/SnackLogContext";

// prettier-ignore
const BuildLogsSnack = lazy(() => import("@src/components/TableModals/CloudLogsModal/BuildLogs/BuildLogsSnack" /* webpackChunkName: "TableModals-BuildLogsSnack" */));

/**
 * TablePage renders all the UI for the table.
 * Must be wrapped by either `ProvidedTablePage` or `ProvidedSubTablePage`.
 */
export default function TablePage() {
  const [tableSchema] = useAtom(tableSchemaAtom, tableScope);
  const snackLogContext = useSnackLogContext();

  // Warn user about leaving when they have a table modal open
  useBeforeUnload(columnModalAtom, tableScope);
  useBeforeUnload(tableModalAtom, tableScope);

  // A ref to the data grid. Contains data grid functions
  const dataGridRef = useRef<DataGridHandle | null>(null);

  if (isEmpty(tableSchema.columns))
    return (
      <Suspense fallback={null}>
        <Fade in style={{ transitionDelay: "500ms" }}>
          <div>
            <EmptyTable />

            <Suspense fallback={null}>
              <ColumnModals />
            </Suspense>

            <Suspense fallback={null}>
              <TableModals />
            </Suspense>
          </div>
        </Fade>
      </Suspense>
    );

  return (
    <ActionParamsProvider>
      <ErrorBoundary FallbackComponent={InlineErrorFallback}>
        <Suspense fallback={<TableToolbarSkeleton />}>
          <TableToolbar />
        </Suspense>
      </ErrorBoundary>

      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<HeaderRowSkeleton />}>
          <Table dataGridRef={dataGridRef} />
        </Suspense>
      </ErrorBoundary>

      <ErrorBoundary FallbackComponent={InlineErrorFallback}>
        <Suspense fallback={null}>
          <SideDrawer dataGridRef={dataGridRef} />
        </Suspense>
      </ErrorBoundary>

      <ErrorBoundary FallbackComponent={InlineErrorFallback}>
        <Suspense fallback={null}>
          <ColumnMenu />
          <ColumnModals />
        </Suspense>
      </ErrorBoundary>

      <ErrorBoundary FallbackComponent={InlineErrorFallback}>
        <Suspense fallback={null}>
          <TableModals />
          {snackLogContext.isSnackLogOpen && (
            <Suspense fallback={null}>
              <BuildLogsSnack
                onClose={snackLogContext.closeSnackLog}
                onOpenPanel={alert}
              />
            </Suspense>
          )}
        </Suspense>
      </ErrorBoundary>
    </ActionParamsProvider>
  );
}
