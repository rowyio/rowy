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
            borderRadius: 1,
            "& .MuiInputBase-input": {
              paddingTop: `${(36 - 24) / 2}px`,
              paddingBottom: `${(36 - 24) / 2}px`,
              display: "flex",
              alignItems: "center",
            },
          },
        }}
        InputLabelProps={{ style: { opacity: 0 } }}
        SelectProps={{
          displayEmpty: true,
          renderValue: () => (
            <RowHeightIcon
              style={{ display: "block", color: theme.palette.action.active }}
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
