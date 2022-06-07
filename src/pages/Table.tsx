import { useRef, Suspense, lazy } from "react";
import { useAtom, Provider } from "jotai";
import { DebugAtoms } from "@src/atoms/utils";
import { useParams } from "react-router-dom";
import { DataGridHandle } from "react-data-grid";
import { isEmpty } from "lodash-es";

import { Fade } from "@mui/material";

import TableToolbarSkeleton from "@src/components/TableToolbar/TableToolbarSkeleton";
import HeaderRowSkeleton from "@src/components/Table/HeaderRowSkeleton";
import EmptyTable from "@src/components/Table/EmptyTable";
import TableToolbar from "@src/components/TableToolbar";
import Table from "@src/components/Table";
import SideDrawer from "@src/components/SideDrawer";
import ColumnMenu from "@src/components/ColumnMenu";
import ColumnModals from "@src/components/ColumnModals";
import TableModals from "@src/components/TableModals";

import { currentUserAtom, globalScope } from "@src/atoms/globalScope";
import TableSourceFirestore from "@src/sources/TableSourceFirestore";
import {
  tableScope,
  tableIdAtom,
  tableSchemaAtom,
  columnModalAtom,
  tableModalAtom,
} from "@src/atoms/tableScope";
import useBeforeUnload from "@src/hooks/useBeforeUnload";
import ActionParamsProvider from "@src/components/fields/Action/FormDialog/Provider";
import { useSnackLogContext } from "@src/contexts/SnackLogContext";

// prettier-ignore
const BuildLogsSnack = lazy(() => import("@src/components/TableModals/CloudLogsModal/BuildLogs/BuildLogsSnack" /* webpackChunkName: "TableModals-BuildLogsSnack" */));

function TablePage() {
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
          </div>
        </Fade>
      </Suspense>
    );

  return (
    <ActionParamsProvider>
      <Suspense fallback={<TableToolbarSkeleton />}>
        <TableToolbar />
      </Suspense>

      <Suspense fallback={<HeaderRowSkeleton />}>
        <Table dataGridRef={dataGridRef} />
      </Suspense>

      <Suspense fallback={null}>
        <SideDrawer dataGridRef={dataGridRef} />
      </Suspense>

      <Suspense fallback={null}>
        <ColumnMenu />
        <ColumnModals />
      </Suspense>

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
    </ActionParamsProvider>
  );
}

export default function ProvidedTablePage() {
  const { id } = useParams();
  const [currentUser] = useAtom(currentUserAtom, globalScope);

  return (
    <Suspense
      fallback={
        <>
          <TableToolbarSkeleton />
          <HeaderRowSkeleton />
        </>
      }
    >
      <Provider
        key={tableScope.description + "/" + id}
        scope={tableScope}
        initialValues={[
          [tableIdAtom, id],
          [currentUserAtom, currentUser],
        ]}
      >
        <DebugAtoms scope={tableScope} />
        <TableSourceFirestore />
        <main>
          <TablePage />
        </main>
      </Provider>
    </Suspense>
  );
}
