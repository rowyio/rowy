import { Suspense, useMemo } from "react";
import { useAtom, Provider } from "jotai";
import { selectAtom } from "jotai/utils";
import { DebugAtoms } from "@src/atoms/utils";
import { ErrorBoundary } from "react-error-boundary";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { find, isEqual } from "lodash-es";

import Modal from "@src/components/Modal";
import BreadcrumbsSubTable from "@src/components/Table/BreadcrumbsSubTable";
import ErrorFallback from "@src/components/ErrorFallback";
import TableSourceFirestore from "@src/sources/TableSourceFirestore";
import TablePage from "./TablePage";
import TableToolbarSkeleton from "@src/components/TableToolbar/TableToolbarSkeleton";
import HeaderRowSkeleton from "@src/components/Table/HeaderRowSkeleton";

import { globalScope, currentUserAtom } from "@src/atoms/globalScope";
import {
  tableScope,
  tableIdAtom,
  tableSettingsAtom,
  tableSchemaAtom,
} from "@src/atoms/tableScope";
import { ROUTES } from "@src/constants/routes";
import { APP_BAR_HEIGHT } from "@src/layouts/Navigation";

/**
 * Wraps `TablePage` with the data for a top-level table.
 */
export default function ProvidedSubTablePage() {
  const location = useLocation();
  const navigate = useNavigate();
  // Get params from URL: /subTable/:docPath/:subTableKey
  const { docPath, subTableKey } = useParams();

  const [currentUser] = useAtom(currentUserAtom, globalScope);

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
  const subTableCollection =
    docPath + "/" + (sourceColumn?.fieldName || subTableKey);

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
    tableType: "primaryCollection" as "primaryCollection",
    name: sourceColumn?.name || subTableKey || "",
  };

  const rootTableLink = location.pathname.split("/" + ROUTES.subTable)[0];

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
        },
        "& .modal-title-row": {
          height: APP_BAR_HEIGHT,
          "& .MuiDialogTitle-root": {
            px: 2,
            py: (APP_BAR_HEIGHT - 28) / 2 / 8,
          },
          "& .dialog-close": { m: (APP_BAR_HEIGHT - 40) / 2 / 8, ml: -1 },
        },
      }}
      ScrollableDialogContentProps={{
        disableTopDivider: true,
        disableBottomDivider: true,
        style: { "--dialog-spacing": 0, "--dialog-contents-spacing": 0 } as any,
      }}
    >
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense
          fallback={
            <>
              <TableToolbarSkeleton />
              <HeaderRowSkeleton />
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
            <TableSourceFirestore />
            <TablePage />
          </Provider>
        </Suspense>
      </ErrorBoundary>
    </Modal>
  );
}
