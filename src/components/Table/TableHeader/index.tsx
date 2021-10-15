import { Stack, Button } from "@mui/material";

import { isCollectionGroup } from "utils/fns";
import AddRowIcon from "assets/icons/AddRow";

import Filters from "../Filters";
import ImportCSV from "./ImportCsv";
import Export from "./Export";
import LoadedRowsStatus from "./LoadedRowsStatus";
import TableSettings from "./TableSettings";
import TableLogs from "./TableLogs";
import HiddenFields from "../HiddenFields";
import RowHeight from "./RowHeight";
import Extensions from "./Extensions";
import ReExecute from "./ReExecute";

import { useAppContext } from "contexts/AppContext";
import { useProjectContext } from "contexts/ProjectContext";
import { FieldType } from "constants/fields";

export const TABLE_HEADER_HEIGHT = 44;

export default function TableHeader() {
  const { userClaims } = useAppContext();
  const { addRow, tableState } = useProjectContext();

  const hasDerivatives =
    tableState &&
    Object.values(tableState.columns)?.filter(
      (column) => column.type === FieldType.derivative
    ).length > 0;
  const hasExtensions =
    tableState &&
    tableState.config?.compiledExtension?.replace(/\W/g, "")?.length > 0;

  if (!tableState || !tableState.columns) return null;

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
      {/*
      <ButtonGroup
        variant="contained"
        aria-label="Split button"
        style={{ display: "flex" }}
      >
        */}
      <Button
        disabled={isCollectionGroup() || !addRow}
        onClick={() => addRow!()}
        variant="contained"
        color="primary"
        startIcon={<AddRowIcon />}
        // sx={{ pr: 1.5 }}
      >
        Add row
      </Button>
      {/*
        <Button
          // aria-controls={open ? 'split-button-menu' : undefined}
          // aria-expanded={open ? 'true' : undefined}
          // aria-label="select merge strategy"
          aria-haspopup="menu"
          style={{ padding: 0 }}
        >
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
      */}
      {/* Spacer */} <div />
      <HiddenFields />
      <Filters />
      {/* Spacer */} <div />
      <LoadedRowsStatus />
      <div style={{ flexGrow: 1, minWidth: 64 }} />
      <RowHeight />
      {/* Spacer */} <div />
      {!isCollectionGroup() && <ImportCSV />}
      <Export />
      {userClaims?.roles?.includes("ADMIN") && (
        <>
          {/* Spacer */} <div />
          <Extensions />
          <TableLogs />
          {(hasDerivatives || hasExtensions) && <ReExecute />}
          {/* Spacer */} <div />
          <TableSettings />
        </>
      )}
      <div className="end-spacer" />
    </Stack>
  );
}
