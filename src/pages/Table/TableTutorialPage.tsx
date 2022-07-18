import { Suspense } from "react";
import { useAtom, useSetAtom, Provider } from "jotai";
import { DebugAtoms } from "@src/atoms/utils";
import { ErrorBoundary } from "react-error-boundary";

import { Box, Typography, Button } from "@mui/material";
import { Import as ImportIcon } from "@src/assets/icons";

import ErrorFallback from "@src/components/ErrorFallback";
import TablePage from "./TablePage";
import TableToolbarSkeleton from "@src/components/TableToolbar/TableToolbarSkeleton";
import TableSkeleton from "@src/components/Table/TableSkeleton";
import TableTutorial from "@src/components/TableTutorial";
import EmptyState from "@src/components/EmptyState";
import TableModals from "@src/components/TableModals";

import { projectScope, currentUserAtom } from "@src/atoms/projectScope";
import {
  tableScope,
  tableIdAtom,
  tableSettingsAtom,
  tableSchemaAtom,
  tableColumnsOrderedAtom,
  tableRowsAtom,
  tableModalAtom,
  importCsvAtom,
} from "@src/atoms/tableScope";

import {
  TUTORIAL_COLLECTION,
  TUTORIAL_TABLE_SETTINGS,
  TUTORIAL_TABLE_SCHEMA,
  TableSourceTutorial,
} from "@src/components/TableTutorial/TableSourceTutorial";
import { TOP_BAR_HEIGHT } from "@src/layouts/Navigation/TopBar";
import * as csvData from "@src/components/TableTutorial/data";

/**
 * Wraps `TablePage` with the data for a top-level table.
 */
export default function TableTutorialPage() {
  const [currentUser] = useAtom(currentUserAtom, projectScope);

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
          key={tableScope.description + "/" + TUTORIAL_COLLECTION}
          scope={tableScope}
          initialValues={[
            [currentUserAtom, currentUser],
            [tableIdAtom, TUTORIAL_COLLECTION],
            [tableSettingsAtom, TUTORIAL_TABLE_SETTINGS],
            [tableSchemaAtom, TUTORIAL_TABLE_SCHEMA],
          ]}
        >
          <DebugAtoms scope={tableScope} />
          <TableSourceTutorial />
          <Suspense
            fallback={
              <>
                <TableToolbarSkeleton />
                <TableSkeleton />
              </>
            }
          >
            <Box
              component="main"
              sx={{
                ".empty-state--full-screen, #empty-table": {
                  height: `calc(100vh - ${TOP_BAR_HEIGHT}px - min(50vh, 440px)) !important`,
                },
                ".table-container > .rdg": {
                  paddingBottom:
                    "max(env(safe-area-inset-bottom), min(50vh, 440px))",
                  width: "100%",

                  ".rdg-row, .rdg-header-row": {
                    marginRight: `env(safe-area-inset-right)`,
                  },
                },
              }}
            >
              <Content />
              <TableTutorial />
            </Box>
          </Suspense>
        </Provider>
      </Suspense>
    </ErrorBoundary>
  );
}

function Content() {
  const [tableColumnsOrdered] = useAtom(tableColumnsOrderedAtom, tableScope);
  const [tableRows] = useAtom(tableRowsAtom, tableScope);
  const openTableModal = useSetAtom(tableModalAtom, tableScope);
  const setImportCsv = useSetAtom(importCsvAtom, tableScope);

  if (tableColumnsOrdered.length === 0 || tableRows.length === 0) {
    return (
      <EmptyState
        Icon={(() => null) as any}
        message="Get started"
        description={
          <>
            <Typography>There is no data in this table.</Typography>

            <Typography>You can import our sample CSV file:</Typography>

            <Button
              variant="contained"
              color="primary"
              startIcon={<ImportIcon />}
              onClick={() => {
                setImportCsv({ importType: "csv", csvData });
                openTableModal("importCsv");
              }}
            >
              Import CSV
            </Button>

            <TableModals />
          </>
        }
      />
    );
  }

  return <TablePage disableSideDrawer />;
}
