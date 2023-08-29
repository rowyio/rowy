import { useAtom } from "jotai";

import {
  Grid,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
  alpha,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";

import {
  tableColumnsOrderedAtom,
  tableScope,
  tableSettingsAtom,
  tableSortsAtom,
} from "@src/atoms/tableScope";
import SortPopover from "./SortPopover";
import ColumnSelect from "@src/components/Table/ColumnSelect";

import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { projectScope, userRolesAtom } from "@src/atoms/projectScope";
import useSaveTableSorts from "@src/components/Table/ColumnHeader/useSaveTableSorts";

export default function Sort() {
  const [userRoles] = useAtom(userRolesAtom, projectScope);
  const [tableSettings] = useAtom(tableSettingsAtom, tableScope);

  const canEditColumns = Boolean(
    userRoles.includes("ADMIN") ||
      tableSettings.modifiableBy?.some((r) => userRoles.includes(r))
  );

  const [tableSorts, setTableSorts] = useAtom(tableSortsAtom, tableScope);
  const triggerSaveTableSorts = useSaveTableSorts(canEditColumns);

  const [tableColumnsOrdered] = useAtom(tableColumnsOrderedAtom, tableScope);

  const sortColumns = tableColumnsOrdered.map(({ key, name, type, index }) => ({
    value: key,
    label: name,
    type,
    index,
  }));

  return (
    <SortPopover>
      {({ handleClose }) => (
        <Grid container spacing={2} sx={{ p: 3 }}>
          <Grid item xs={5.5}>
            <ColumnSelect
              multiple={false}
              label="Column"
              options={sortColumns}
              value={tableSorts[0].key}
              onChange={(value: string | null) => {
                setTableSorts(
                  value === null
                    ? []
                    : [{ key: value, direction: tableSorts[0].direction }]
                );
                triggerSaveTableSorts(
                  value === null
                    ? []
                    : [{ key: value, direction: tableSorts[0].direction }]
                );
              }}
            />
          </Grid>

          <Grid item xs={5.5}>
            <TextField
              label="Sort"
              select
              variant="filled"
              fullWidth
              value={tableSorts[0].direction}
              onChange={(e) => {
                setTableSorts([
                  {
                    key: tableSorts[0].key,
                    direction: e.target.value === "asc" ? "asc" : "desc",
                  },
                ]);
                triggerSaveTableSorts([
                  {
                    key: tableSorts[0].key,
                    direction: e.target.value === "asc" ? "asc" : "desc",
                  },
                ]);
              }}
            >
              <MenuItem key="asc" value="asc">
                <Stack direction="row" gap={1} alignItems="center">
                  <ArrowUpwardIcon />
                  <Typography>Sort ascending</Typography>
                </Stack>
              </MenuItem>
              <MenuItem key="desc" value="desc">
                <Stack direction="row" gap={1} alignItems="center">
                  <ArrowDownwardIcon />
                  <Typography>Sort descending</Typography>
                </Stack>
              </MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={1} alignSelf="flex-end">
            <IconButton
              size="small"
              onClick={() => {
                setTableSorts([]);
                triggerSaveTableSorts([]);
              }}
              sx={{
                "&:hover, &:focus": {
                  color: "error.main",
                  backgroundColor: (theme) =>
                    alpha(
                      theme.palette.error.main,
                      theme.palette.action.hoverOpacity * 2
                    ),
                },
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Grid>
        </Grid>
      )}
    </SortPopover>
  );
}
