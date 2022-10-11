import { Suspense, useMemo } from "react";
import { useAtom, Provider } from "jotai";
import { DebugAtoms } from "@src/atoms/utils";
import { useParams, useOutlet } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { find, isEmpty } from "lodash-es";

import ErrorFallback, {
  ERROR_TABLE_NOT_FOUND,
} from "@src/components/ErrorFallback";
import TableSourceFirestore from "@src/sources/TableSourceFirestore";
import TablePage from "./TablePage";
import TableToolbarSkeleton from "@src/components/TableToolbar/TableToolbarSkeleton";
import TableSkeleton from "@src/components/Table/TableSkeleton";

import {
  projectScope,
  projectIdAtom,
  currentUserAtom,
  projectSettingsAtom,
  tablesAtom,
} from "@src/atoms/projectScope";
import {
  tableScope,
  tableIdAtom,
  tableSettingsAtom,
} from "@src/atoms/tableScope";
import useDocumentTitle from "@src/hooks/useDocumentTitle";

/**
 * Wraps `TablePage` with the data for a top-level table.
 * `SubTablePage` is inserted in the outlet, alongside `TablePage`.
 */
export default function ProvidedTablePage() {
  const { id } = useParams();
  const outlet = useOutlet();
  const [projectId] = useAtom(projectIdAtom, projectScope);
  const [currentUser] = useAtom(currentUserAtom, projectScope);
  const [projectSettings] = useAtom(projectSettingsAtom, projectScope);
  const [tables] = useAtom(tablesAtom, projectScope);

  const tableSettings = useMemo(() => find(tables, ["id", id]), [tables, id]);
  useDocumentTitle(projectId, tableSettings ? tableSettings.name : "Not found");

  if (!tableSettings) {
    if (isEmpty(projectSettings)) {
      return (
        <>
          <TableToolbarSkeleton />
          <TableSkeleton />
        </>
      );
    } else {
      throw new Error(ERROR_TABLE_NOT_FOUND + ": " + id);
    }
  }

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
          <Suspense
            fallback={
              <>
                <TableToolbarSkeleton />
                <TableSkeleton />
              </>
            }
          >
            <main>
              <TablePage disableModals={Boolean(outlet)} />
            </main>
          </Suspense>
          <Suspense fallback={null}>{outlet}</Suspense>
        </Provider>
      </Suspense>
    </ErrorBoundary>
  );
}
