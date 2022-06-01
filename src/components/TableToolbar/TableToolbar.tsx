import { lazy, Suspense } from "react";
import { useAtom } from "jotai";

import { Stack } from "@mui/material";
import { ButtonSkeleton } from "./TableToolbarSkeleton";

import AddRow from "./AddRow";
import LoadedRowsStatus from "./LoadedRowsStatus";
import TableSettings from "./TableSettings";
import HiddenFields from "./HiddenFields";
import RowHeight from "./RowHeight";
// import BuildLogsSnack from "./CloudLogs/BuildLogs/BuildLogsSnack";

import { globalScope, userRolesAtom } from "@src/atoms/globalScope";
import {
  tableScope,
  tableSettingsAtom,
  tableSchemaAtom,
} from "@src/atoms/tableScope";
import { FieldType } from "@src/constants/fields";
// import { useSnackLogContext } from "@src/contexts/SnackLogContext";

// prettier-ignore
const Filters = lazy(() => import("./Filters" /* webpackChunkName: "Filters" */));
// prettier-ignore
const Export = lazy(() => import("./Export" /* webpackChunkName: "Export" */));
// prettier-ignore
const ImportCsv = lazy(() => import("./ImportCsv" /* webpackChunkName: "ImportCsv" */));
// prettier-ignore
// const CloudLogs = lazy(() => import("./CloudLogs" /* webpackChunkName: "CloudLogs" */));
// prettier-ignore
// const Extensions = lazy(() => import("./Extensions" /* webpackChunkName: "Extensions" */));
// prettier-ignore
// const Webhooks = lazy(() => import("./Webhooks" /* webpackChunkName: "Webhooks" */));
// prettier-ignore
const ReExecute = lazy(() => import("./ReExecute" /* webpackChunkName: "ReExecute" */));

export const TABLE_TOOLBAR_HEIGHT = 44;

export default function TableToolbar() {
  const [userRoles] = useAtom(userRolesAtom, globalScope);
  const [tableSettings] = useAtom(tableSettingsAtom, tableScope);
  const [tableSchema] = useAtom(tableSchemaAtom, tableScope);
  // const snackLogContext = useSnackLogContext();

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
        overflowX: "auto",
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
      {/* Spacer */} <div />
      <HiddenFields />
      <Suspense fallback={<ButtonSkeleton />}>
        <Filters />
      </Suspense>
      {/* Spacer */} <div />
      <LoadedRowsStatus />
      <div style={{ flexGrow: 1, minWidth: 64 }} />
      <RowHeight />
      {/* Spacer */} <div />
      {tableSettings.tableType !== "collectionGroup" && (
        <Suspense fallback={<ButtonSkeleton />}>
          <ImportCsv />
        </Suspense>
      )}
      <Suspense fallback={<ButtonSkeleton />}>
        <Export />
      </Suspense>
      {userRoles.includes("ADMIN") && (
        <>
          {/* Spacer */} <div />
          {/* 
      <Suspense fallback={<ButtonSkeleton/>}>
          <Webhooks /> 
      </Suspense>
          */}
          {/* 
      <Suspense fallback={<ButtonSkeleton/>}>
          <Extensions /> 
      </Suspense>
          */}
          {/* 
      <Suspense fallback={<ButtonSkeleton/>}>
          <CloudLogs /> 
      </Suspense>
          */}
          {/* {snackLogContext.isSnackLogOpen && (
            <BuildLogsSnack
              onClose={snackLogContext.closeSnackLog}
              onOpenPanel={alert}
            />
          )} */}
          {(hasDerivatives || hasExtensions) && (
            <Suspense fallback={<ButtonSkeleton />}>
              <ReExecute />
            </Suspense>
          )}
          {/* Spacer */} <div />
          <TableSettings />
        </>
      )}
      <div className="end-spacer" />
    </Stack>
  );
}
