import { lazy, Suspense } from "react";
import { useAtom, useSetAtom } from "jotai";

import { Stack } from "@mui/material";
import WebhookIcon from "@mui/icons-material/Webhook";
import {
  Export as ExportIcon,
  Extension as ExtensionIcon,
  CloudLogs as CloudLogsIcon,
} from "@src/assets/icons";
import TableToolbarButton from "./TableToolbarButton";
import { ButtonSkeleton } from "./TableToolbarSkeleton";

import AddRow from "./AddRow";
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

// prettier-ignore
const Filters = lazy(() => import("./Filters" /* webpackChunkName: "Filters" */));
// prettier-ignore
const ImportData = lazy(() => import("./ImportData/ImportData" /* webpackChunkName: "ImportData" */));

// prettier-ignore
const ReExecute = lazy(() => import("./ReExecute" /* webpackChunkName: "ReExecute" */));

export const TABLE_TOOLBAR_HEIGHT = 44;

export default function TableToolbar() {
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
      <AddRow />
      <div /> {/* Spacer */}
      <HiddenFields />
      <Suspense fallback={<ButtonSkeleton />}>
        <Filters />
      </Suspense>
      <div /> {/* Spacer */}
      <LoadedRowsStatus />
      <div style={{ flexGrow: 1, minWidth: 64 }} />
      <RowHeight />
      <div /> {/* Spacer */}
      {tableSettings.tableType !== "collectionGroup" && (
        <Suspense fallback={<ButtonSkeleton />}>
          <ImportData />
        </Suspense>
      )}
      <Suspense fallback={<ButtonSkeleton />}>
        <TableToolbarButton
          title="Export/Download"
          onClick={() => openTableModal("export")}
          icon={<ExportIcon />}
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
          />
          <TableToolbarButton
            title="Extensions"
            onClick={() => {
              if (projectSettings.rowyRunUrl) openTableModal("extensions");
              else openRowyRunModal({ feature: "Extensions" });
            }}
            icon={<ExtensionIcon />}
          />
          <TableToolbarButton
            title="Cloud logs"
            icon={<CloudLogsIcon />}
            onClick={() => {
              if (projectSettings.rowyRunUrl) openTableModal("cloudLogs");
              else openRowyRunModal({ feature: "Cloud logs" });
            }}
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
