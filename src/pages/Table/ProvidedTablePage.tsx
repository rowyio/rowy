import { lazy, Suspense } from "react";
import { useAtom, Provider } from "jotai";
import { DebugAtoms } from "@src/atoms/utils";
import { useParams, useOutlet, Link } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { find, isEmpty } from "lodash-es";
import useOffline from "@src/hooks/useOffline";

import { Typography, Button } from "@mui/material";

import ErrorFallback from "@src/components/ErrorFallback";
import TableSourceFirestore from "@src/sources/TableSourceFirestore";
import TableToolbarSkeleton from "@src/components/TableToolbar/TableToolbarSkeleton";
import TableSkeleton from "@src/components/Table/TableSkeleton";
import EmptyState from "@src/components/EmptyState";
import OfflineIcon from "@mui/icons-material/CloudOff";
import { Tables as TablesIcon } from "@src/assets/icons";

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
import { SyncAtomValue } from "@src/atoms/utils";
import { ROUTES } from "@src/constants/routes";
import useDocumentTitle from "@src/hooks/useDocumentTitle";

// prettier-ignore
const TablePage = lazy(() => import("./TablePage" /* webpackChunkName: "TablePage" */));

/**
 * Wraps `TablePage` with the data for a top-level table.
 * `SubTablePage` is inserted in the outlet, alongside `TablePage`.
 *
 * Interfaces with `projectScope` atoms to find the correct table (or sub-table)
 * settings and schema.
 *
 * - Renders the Jotai `Provider` with `tableScope`
 * - Renders `TableSourceFirestore`, which queries Firestore and stores data in
 *   atoms in `tableScope`
 */
export default function ProvidedTablePage() {
  const { id } = useParams();
  const outlet = useOutlet();
  const [projectId] = useAtom(projectIdAtom, projectScope);
  const [currentUser] = useAtom(currentUserAtom, projectScope);
  const [projectSettings] = useAtom(projectSettingsAtom, projectScope);
  const [tables] = useAtom(tablesAtom, projectScope);
  const isOffline = useOffline();

  const tableSettings = find(tables, ["id", id]);
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
      if (isOffline) {
        return (
          <EmptyState
            role="alert"
            fullScreen
            Icon={OfflineIcon}
            message="You’re offline"
          />
        );
      } else {
        return (
          <EmptyState
            role="alert"
            fullScreen
            message="Table not found"
            description={
              <>
                <Typography variant="inherit">
                  Make sure you have the right ID
                </Typography>
                <code>{id}</code>
                <Button
                  variant="outlined"
                  color="secondary"
                  component={Link}
                  to={ROUTES.tables}
                  startIcon={<TablesIcon />}
                >
                  All tables
                </Button>
              </>
            }
          />
        );
      }
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
          <SyncAtomValue
            atom={tableSettingsAtom}
            scope={tableScope}
            value={tableSettings}
          />

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
              <TablePage enableRowSelection disableModals={Boolean(outlet)} />
            </main>
          </Suspense>
          <Suspense fallback={null}>{outlet}</Suspense>
        </Provider>
      </Suspense>
    </ErrorBoundary>
  );
}
