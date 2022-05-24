import { useAtom } from "jotai";

import { Stack } from "@mui/material";
import AddRow from "./AddRow";
// import Filters from "./Filters";
import ImportCSV from "./ImportCsv";
// import Export from "./Export";
import LoadedRowsStatus from "./LoadedRowsStatus";
import TableSettings from "./TableSettings";
// import CloudLogs from "./CloudLogs";
import HiddenFields from "./HiddenFields";
import RowHeight from "./RowHeight";
// import Extensions from "./Extensions";
// import Webhooks from "./Webhooks";
import ReExecute from "./ReExecute";
// import BuildLogsSnack from "./CloudLogs/BuildLogs/BuildLogsSnack";

import { globalScope, userRolesAtom } from "@src/atoms/globalScope";
import {
  tableScope,
  tableSettingsAtom,
  tableSchemaAtom,
} from "@src/atoms/tableScope";
import { FieldType } from "@src/constants/fields";
// import { useSnackLogContext } from "@src/contexts/SnackLogContext";

export const TABLE_HEADER_HEIGHT = 44;

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
        height: TABLE_HEADER_HEIGHT,
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
      {/* <Filters /> */}
      {/* Spacer */} <div />
      <LoadedRowsStatus />
      <div style={{ flexGrow: 1, minWidth: 64 }} />
      <RowHeight />
      {/* Spacer */} <div />
      {tableSettings.tableType !== "collectionGroup" && <ImportCSV />}
      {/* <Export /> */}
      {userRoles.includes("ADMIN") && (
        <>
          {/* Spacer */} <div />
          {/* <Webhooks /> */}
          {/* <Extensions /> */}
          {/* <CloudLogs /> */}
          {/* {snackLogContext.isSnackLogOpen && (
            <BuildLogsSnack
              onClose={snackLogContext.closeSnackLog}
              onOpenPanel={alert}
            />
          )} */}
          {(hasDerivatives || hasExtensions) && <ReExecute />}
          {/* Spacer */} <div />
          <TableSettings />
        </>
      )}
      <div className="end-spacer" />
    </Stack>
  );
}
