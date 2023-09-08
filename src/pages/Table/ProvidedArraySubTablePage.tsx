import { lazy, Suspense, useMemo } from "react";
import { useAtom, Provider } from "jotai";
import { selectAtom } from "jotai/utils";
import { DebugAtoms } from "@src/atoms/utils";
import { ErrorBoundary } from "react-error-boundary";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { find, isEqual } from "lodash-es";

import Modal from "@src/components/Modal";
import BreadcrumbsSubTable from "@src/components/Table/Breadcrumbs/BreadcrumbsSubTable";
import ErrorFallback from "@src/components/ErrorFallback";
import ArraySubTableSourceFirestore from "@src/sources/TableSourceFirestore/ArraySubTableSourceFirestore";
import TableToolbarSkeleton from "@src/components/TableToolbar/TableToolbarSkeleton";
import TableSkeleton from "@src/components/Table/TableSkeleton";

import { projectScope, currentUserAtom } from "@src/atoms/projectScope";
import {
  tableScope,
  tableIdAtom,
  tableSettingsAtom,
  tableSchemaAtom,
} from "@src/atoms/tableScope";
import { ROUTES } from "@src/constants/routes";
import { TOP_BAR_HEIGHT } from "@src/layouts/Navigation/TopBar";
import { TABLE_TOOLBAR_HEIGHT } from "@src/components/TableToolbar";

// prettier-ignore
const TablePage = lazy(() => import("./TablePage" /* webpackChunkName: "TablePage" */));

/**
 * Wraps `TablePage` with the data for a array-sub-table.
 *
 * Differences to `ProvidedTablePage`:
 * - Renders a `Modal`
 * - When this is a child of `ProvidedTablePage`, the `TablePage` rendered for
 *   the root table has its modals disabled
 */
export default function ProvidedArraySubTablePage() {
  const location = useLocation();
  const navigate = useNavigate();
  // Get params from URL: /arraySubTable/:docPath/:subTableKey
  const { docPath, subTableKey } = useParams();

  const [currentUser] = useAtom(currentUserAtom, projectScope);

  // Get table settings and the source column from root table
  const [rootTableSettings] = useAtom(tableSettingsAtom, tableScope);
  const [sourceColumn] = useAtom(
    useMemo(
      () =>
        selectAtom(
          tableSchemaAtom,
          (tableSchema) => find(tableSchema.columns, ["key", subTableKey]),
          isEqual
        ),
      [subTableKey]
    ),
    tableScope
  );

  // Consumed by children as `tableSettings.collection`
  const subTableCollection = docPath ?? ""; // + "/" + (sourceColumn?.fieldName || subTableKey);

  // Must be compatible with `getTableSchemaPath`: tableId/rowId/subTableKey
  // This is why we can’t have a sub-table column fieldName !== key
  const subTableId =
    docPath?.replace(rootTableSettings.collection, rootTableSettings.id) +
    "/" +
    subTableKey;

  // Write fake tableSettings
  const subTableSettings = {
    ...rootTableSettings,
    collection: subTableCollection,
    id: subTableId,
    subTableKey,
    isCollection: false,
    tableType: "primaryCollection" as "primaryCollection",
    name: sourceColumn?.name || subTableKey || "",
  };

  const rootTableLink = location.pathname.split("/" + ROUTES.arraySubTable)[0];

  return (
    <Modal
      title={
        <BreadcrumbsSubTable
          rootTableSettings={rootTableSettings}
          subTableSettings={subTableSettings}
          rootTableLink={rootTableLink}
        />
      }
      onClose={() => navigate(rootTableLink)}
      disableBackdropClick
      disableEscapeKeyDown
      fullScreen
      sx={{
        "& > .MuiDialog-container > .MuiPaper-root": {
          bgcolor: "background.default",
          backgroundImage: "none",
        },
        "& .modal-title-row": {
          height: TOP_BAR_HEIGHT,
          "& .MuiDialogTitle-root": {
            px: 2,
            py: (TOP_BAR_HEIGHT - 28) / 2 / 8,
          },
          "& .dialog-close": { m: (TOP_BAR_HEIGHT - 40) / 2 / 8, ml: -1 },
        },
        "& .table-container": {
          height: `calc(100vh - ${TOP_BAR_HEIGHT}px - ${TABLE_TOOLBAR_HEIGHT}px - 16px)`,
        },
      }}
      ScrollableDialogContentProps={{
        disableTopDivider: true,
        disableBottomDivider: true,
        style: { "--dialog-spacing": 0, "--dialog-contents-spacing": 0 } as any,
      }}
      BackdropProps={{ key: "sub-table-modal-backdrop" }}
    >
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
            key={tableScope.description + "/subTable/" + subTableSettings.id}
            scope={tableScope}
            initialValues={[
              [currentUserAtom, currentUser],
              [tableIdAtom, subTableSettings.id],
              [tableSettingsAtom, subTableSettings],
            ]}
          >
            <DebugAtoms scope={tableScope} />
            <ArraySubTableSourceFirestore />
            <TablePage
              enableRowSelection={false}
              disabledTools={[
                "import",
                "export",
                "webhooks",
                "extensions",
                "cloud_logs",
              ]}
            />
          </Provider>
        </Suspense>
      </ErrorBoundary>
    </Modal>
  );
}
