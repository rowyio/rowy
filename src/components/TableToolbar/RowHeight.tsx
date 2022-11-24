import { useRef, useState } from "react";
import { useAtom } from "jotai";

import { useTheme, TextField, ListSubheader, MenuItem } from "@mui/material";
import { RowHeight as RowHeightIcon } from "@src/assets/icons";
import TableToolbarButton from "./TableToolbarButton";

import {
  tableScope,
  tableSchemaAtom,
  updateTableSchemaAtom,
} from "@src/atoms/tableScope";
import { DEFAULT_ROW_HEIGHT } from "@src/components/Table";

const ROW_HEIGHTS = [32, 40, 64, 96, 128, 160].map((x) => x + 1);

export default function RowHeight() {
  const theme = useTheme();

  const buttonRef = useRef<HTMLButtonElement>(null);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [tableSchema] = useAtom(tableSchemaAtom, tableScope);
  const [updateTableSchema] = useAtom(updateTableSchemaAtom, tableScope);

  const rowHeight = tableSchema.rowHeight ?? DEFAULT_ROW_HEIGHT;

  return (
    <>
      <TableToolbarButton
        disabled={!updateTableSchema}
        title="Row height"
        icon={<RowHeightIcon />}
        onClick={handleOpen}
        ref={buttonRef}
      />

      <TextField
        select
        value={rowHeight ?? DEFAULT_ROW_HEIGHT}
        onChange={(event) => {
          if (updateTableSchema)
            updateTableSchema({ rowHeight: Number(event.target.value) });
        }}
        style={{ display: "none" }}
        SelectProps={{
          open: open,
          onOpen: handleOpen,
          onClose: handleClose,
          MenuProps: {
            anchorEl: buttonRef.current,
            anchorOrigin: { vertical: "bottom", horizontal: "right" },
            transformOrigin: { vertical: "top", horizontal: "right" },
            style: { zIndex: theme.zIndex.tooltip },
          },
        }}
        label="Row height"
        id="row-height-select"
      >
        <ListSubheader>Row height</ListSubheader>
        {ROW_HEIGHTS.map((height) => (
          <MenuItem key={height} value={height}>
            {height - 1}px
          </MenuItem>
        ))}
      </TextField>
    </>
  );
}
