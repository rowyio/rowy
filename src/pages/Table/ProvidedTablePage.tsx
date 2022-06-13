import { Suspense, useMemo } from "react";
import { useAtom, Provider } from "jotai";
import { DebugAtoms } from "@src/atoms/utils";
import { useParams, Outlet } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { find } from "lodash-es";

import ErrorFallback, {
  ERROR_TABLE_NOT_FOUND,
} from "@src/components/ErrorFallback";
import TableSourceFirestore from "@src/sources/TableSourceFirestore";
import TablePage from "./TablePage";
import TableToolbarSkeleton from "@src/components/TableToolbar/TableToolbarSkeleton";
import TableSkeleton from "@src/components/Table/TableSkeleton";

import {
  globalScope,
  currentUserAtom,
  tablesAtom,
} from "@src/atoms/globalScope";
import {
  tableScope,
  tableIdAtom,
  tableSettingsAtom,
} from "@src/atoms/tableScope";

/**
 * Wraps `TablePage` with the data for a top-level table.
 * `SubTablePage` is inserted in the outlet, alongside `TablePage`.
 */
export default function ProvidedTablePage() {
  const { id } = useParams();
  const [currentUser] = useAtom(currentUserAtom, globalScope);
  const [tables] = useAtom(tablesAtom, globalScope);

  const tableSettings = useMemo(() => find(tables, ["id", id]), [tables, id]);
  if (!tableSettings) throw new Error(ERROR_TABLE_NOT_FOUND + ": " + id);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense
        fallback={
          <>
            <TableToolbarSkeleton />
            <TableSkeleton />
          </>
        }
      >
        <Provider
          key={tableScope.description + "/" + id}
          scope={tableScope}
          initialValues={[
            [currentUserAtom, currentUser],
            [tableIdAtom, id],
            [tableSettingsAtom, tableSettings],
          ]}
        >
          <DebugAtoms scope={tableScope} />
          <TableSourceFirestore />
          <main>
            <TablePage />
          </main>
          <Suspense fallback={null}>
            <Outlet />
          </Suspense>
        </Provider>
      </Suspense>
    </ErrorBoundary>
  );
}
