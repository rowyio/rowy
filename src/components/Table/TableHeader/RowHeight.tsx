import { useRef, useState } from "react";

import { useTheme, TextField, ListSubheader, MenuItem } from "@mui/material";
import RowHeightIcon from "@src/assets/icons/RowHeight";

import TableHeaderButton from "./TableHeaderButton";
import { useProjectContext } from "@src/contexts/ProjectContext";

const ROW_HEIGHTS = [33, 41, 65, 97, 129, 161];

export default function RowHeight() {
  const theme = useTheme();

  const buttonRef = useRef<HTMLButtonElement>(null);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { tableActions, tableState } = useProjectContext();

  const rowHeight = tableState?.config.rowHeight;
  const updateConfig = tableActions?.table.updateConfig;

  return (
    <>
      <TableHeaderButton
        disabled={!tableState || !tableActions}
        title="Row height"
        icon={<RowHeightIcon />}
        onClick={handleOpen}
        ref={buttonRef}
      />

      <TextField
        select
        value={rowHeight ?? 41}
        onChange={(event) => {
          if (updateConfig) updateConfig("rowHeight", event.target.value);
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
