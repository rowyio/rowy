import { useRef, useState } from "react";

import {
  useTheme,
  TextField,
  ListSubheader,
  MenuItem,
} from "@material-ui/core";
import RowHeightIcon from "assets/icons/RowHeight";

import TableHeaderButton from "./TableHeaderButton";
import { useFiretableContext } from "contexts/FiretableContext";

export default function RowHeight() {
  const theme = useTheme();

  const buttonRef = useRef<HTMLButtonElement>(null);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { tableActions, tableState } = useFiretableContext();

  const rowHeight = tableState?.config.rowHeight;
  const updateConfig = tableActions?.table.updateConfig;

  console.log(buttonRef);

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
        <MenuItem value={37}>Short</MenuItem>
        <MenuItem value={43}>Tall</MenuItem>
        <MenuItem value={65}>Grande</MenuItem>
        <MenuItem value={100}>Venti</MenuItem>
        <MenuItem value={150}>Trenta</MenuItem>
      </TextField>
    </>
  );
}
