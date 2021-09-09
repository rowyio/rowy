import { useRef, useState } from "react";

import {
  useTheme,
  TextField,
  ListSubheader,
  MenuItem,
} from "@material-ui/core";
import RowHeightIcon from "assets/icons/RowHeight";

import TableHeaderButton from "./TableHeaderButton";
import { useProjectContext } from "contexts/ProjectContext";

const ROW_HEIGHTS = [37, 43, 65, 100, 150];

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
        title="Row Height"
        icon={<RowHeightIcon />}
        onClick={handleOpen}
        ref={buttonRef}
      />

      <TextField
        select
        value={rowHeight ?? 43}
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
        label="Row Height"
        id="row-height-select"
      >
        <ListSubheader>Row Height</ListSubheader>
        {ROW_HEIGHTS.map((height) => (
          <MenuItem key={height} value={height}>
            {height}px
          </MenuItem>
        ))}
      </TextField>
    </>
  );
}
