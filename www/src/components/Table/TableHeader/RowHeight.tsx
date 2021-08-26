import {
  useTheme,
  Tooltip,
  TextField,
  ListSubheader,
  MenuItem,
} from "@material-ui/core";
import RowHeightIcon from "assets/icons/RowHeight";

import { useFiretableContext } from "contexts/FiretableContext";

export default function RowHeight() {
  const theme = useTheme();

  const { tableActions, tableState } = useFiretableContext();

  const rowHeight = tableState?.config.rowHeight;
  const updateConfig = tableActions?.table.updateConfig;

  return (
    <Tooltip title="Row Height">
      <TextField
        disabled={!tableState || !tableActions}
        select
        value={rowHeight ?? 43}
        onChange={(event) => {
          if (updateConfig) updateConfig("rowHeight", event.target.value);
        }}
        size="small"
        InputProps={{
          disableUnderline: true,
          sx: {
            height: 32,
            "&:hover": {
              backgroundColor: theme.palette.action.hover + " !important",
            },

            "& .MuiSelect-select": {
              padding: theme.spacing(0.5, 1) + " !important",
            },
            "& .MuiSelect-icon": { display: "none" },
          },
        }}
        InputLabelProps={{ style: { display: "none" } }}
        SelectProps={{
          displayEmpty: true,
          renderValue: () => (
            <RowHeightIcon
              style={{ display: "block", color: theme.palette.secondary.main }}
            />
          ),
          MenuProps: {
            style: { zIndex: theme.zIndex.tooltip },
          },
        }}
        label="Row Height"
        id="row-height-select"
        hiddenLabel
      >
        <ListSubheader>Row Height</ListSubheader>
        <MenuItem value={37}>Short</MenuItem>
        <MenuItem value={43}>Tall</MenuItem>
        <MenuItem value={65}>Grande</MenuItem>
        <MenuItem value={100}>Venti</MenuItem>
        <MenuItem value={150}>Trenta</MenuItem>
      </TextField>
    </Tooltip>
  );
}
