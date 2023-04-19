import { lazy, Suspense } from "react";
import { useAtom, useSetAtom } from "jotai";

import { Button, Stack } from "@mui/material";
import WebhookIcon from "@mui/icons-material/Webhook";
import {
  Export as ExportIcon,
  Extension as ExtensionIcon,
  CloudLogs as CloudLogsIcon,
  Import as ImportIcon,
} from "@src/assets/icons";

import TableToolbarButton from "./TableToolbarButton";
import { ButtonSkeleton } from "./TableToolbarSkeleton";

import AddRow, { AddRowArraySubTable } from "./AddRow";
import LoadedRowsStatus from "./LoadedRowsStatus";
import TableSettings from "./TableSettings";
import HiddenFields from "./HiddenFields";
import RowHeight from "./RowHeight";
import TableInformation from "./TableInformation";

import {
  projectScope,
  projectSettingsAtom,
  userRolesAtom,
  compatibleRowyRunVersionAtom,
  rowyRunModalAtom,
} from "@src/atoms/projectScope";
import {
  tableScope,
  tableSettingsAtom,
  tableSchemaAtom,
  tableModalAtom,
} from "@src/atoms/tableScope";
import { FieldType } from "@src/constants/fields";
import { TableToolsType } from "@src/types/table";
import FilterIcon from "@mui/icons-material/FilterList";

// prettier-ignore
const Filters = lazy(() => import("./Filters" /* webpackChunkName: "Filters" */));
// prettier-ignore
const ImportData = lazy(() => import("./ImportData/ImportData" /* webpackChunkName: "ImportData" */));

// prettier-ignore
const ReExecute = lazy(() => import("./ReExecute" /* webpackChunkName: "ReExecute" */));

export const TABLE_TOOLBAR_HEIGHT = 44;

export default function TableToolbar({
  disabledTools,
}: {
  disabledTools?: TableToolsType[];
}) {
  const [projectSettings] = useAtom(projectSettingsAtom, projectScope);
  const [userRoles] = useAtom(userRolesAtom, projectScope);
  const [compatibleRowyRunVersion] = useAtom(
    compatibleRowyRunVersionAtom,
    projectScope
  );
  const openRowyRunModal = useSetAtom(rowyRunModalAtom, projectScope);
  const [tableSettings] = useAtom(tableSettingsAtom, tableScope);
  const [tableSchema] = useAtom(tableSchemaAtom, tableScope);
  const openTableModal = useSetAtom(tableModalAtom, tableScope);
  const hasDerivatives =
    Object.values(tableSchema.columns ?? {}).filter(
      (column) => column.type === FieldType.derivative
    ).length > 0;

  const hasExtensions =
    tableSchema.compiledExtension &&
    tableSchema.compiledExtension.replace(/\W/g, "")?.length > 0;

  disabledTools = disabledTools ?? [];
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1}
      sx={{
        pl: (theme) => `max(env(safe-area-inset-left), ${theme.spacing(2)})`,
        pb: 1.5,
        height: TABLE_TOOLBAR_HEIGHT,
        scrollbarWidth: "thin",
        overflowX: "auto",
        "&": { overflowX: "overlay" },
        overflowY: "hidden",
        "& > *": { flexShrink: 0 },

        "& > .end-spacer": {
          width: (theme) =>
            `max(env(safe-area-inset-right), ${theme.spacing(2)})`,
          height: "100%",
          ml: 0,
        },
      }}
    >
      {tableSettings.isCollection === false ? (
        <AddRowArraySubTable />
      ) : (
        <AddRow />
      )}
      <div /> {/* Spacer */}
      <HiddenFields />
      {tableSettings.isCollection === false ? (
        <Button
          variant="outlined"
          color="primary"
          startIcon={<FilterIcon />}
          disabled={true}
        >
          Filter
        </Button>
      ) : (
        <Suspense fallback={<ButtonSkeleton />}>
          <Filters />
        </Suspense>
      )}
      <div /> {/* Spacer */}
      <LoadedRowsStatus />
      <div style={{ flexGrow: 1, minWidth: 64 }} />
      <RowHeight />
      <div /> {/* Spacer */}
      {disabledTools.includes("import") ? (
        <TableToolbarButton
          title="Import data"
          icon={<ImportIcon />}
          disabled={true}
        />
      ) : (
        tableSettings.tableType !== "collectionGroup" && (
          <Suspense fallback={<ButtonSkeleton />}>
            <ImportData />
          </Suspense>
        )
      )}
      <Suspense fallback={<ButtonSkeleton />}>
        <TableToolbarButton
          title="Export/Download"
          onClick={() => openTableModal("export")}
          icon={<ExportIcon />}
          disabled={disabledTools.includes("export")}
        />
      </Suspense>
      {userRoles.includes("ADMIN") && (
        <>
          <div /> {/* Spacer */}
          <TableToolbarButton
            title="Webhooks"
            onClick={() => {
              if (compatibleRowyRunVersion({ minVersion: "1.2.0" })) {
                openTableModal("webhooks");
              } else {
                openRowyRunModal({ feature: "Webhooks", version: "1.2.0" });
              }
            }}
            icon={<WebhookIcon />}
            disabled={disabledTools.includes("webhooks")}
          />
          <TableToolbarButton
            title="Extensions"
            onClick={() => {
              if (projectSettings.rowyRunUrl) openTableModal("extensions");
              else openRowyRunModal({ feature: "Extensions" });
            }}
            icon={<ExtensionIcon />}
            disabled={disabledTools.includes("extensions")}
          />
          <TableToolbarButton
            title="Cloud logs"
            icon={<CloudLogsIcon />}
            onClick={() => {
              if (projectSettings.rowyRunUrl) openTableModal("cloudLogs");
              else openRowyRunModal({ feature: "Cloud logs" });
            }}
            disabled={disabledTools.includes("cloud_logs")}
          />
          {(hasDerivatives || hasExtensions) && (
            <Suspense fallback={<ButtonSkeleton />}>
              <ReExecute />
            </Suspense>
          )}
          <div /> {/* Spacer */}
          <TableSettings />
        </>
      )}
      <TableInformation />
      <div className="end-spacer" />
    </Stack>
  );
}
