import React from "react";

import {
  makeStyles,
  createStyles,
  Grid,
  TextField,
  MenuItem,
  Typography,
  Button,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

import Filters from "./Filters";
import ImportCSV from "./ImportCSV";
import ExportCSV from "./ExportCSV";

import { FireTableFilter } from "hooks/useFiretable";
import { DRAWER_COLLAPSED_WIDTH } from "components/SideDrawer";
import { useFiretableContext } from "contexts/firetableContext";

export const TABLE_HEADER_HEIGHT = 56;

const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      width: `calc(100% - ${DRAWER_COLLAPSED_WIDTH}px)`,
      margin: 0,
      padding: theme.spacing(0, 3, 0, 1),
      minHeight: TABLE_HEADER_HEIGHT,
    },
    collectionName: { textTransform: "uppercase" },

    formControl: {
      minWidth: 120,
      margin: 0,
      marginRight: theme.spacing(1),

      "& > div": {
        height: 32,
        borderRadius: theme.shape.borderRadius,
      },
    },
  })
);

interface Props {
  collection: string;
  rowHeight: number;
  updateConfig: Function;

  columns: any;
  filters: FireTableFilter[];
}
const TableHeader = ({
  collection,
  rowHeight,
  updateConfig,
  columns,
  filters,
}: Props) => {
  const classes = useStyles();
  const { tableActions } = useFiretableContext();

  return (
    <Grid container alignItems="center" spacing={2} className={classes.root}>
      <Grid item>
        <Button
          onClick={() => tableActions?.row.add()}
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
        >
          Add Row
        </Button>
      </Grid>

      <Grid item />

      <Grid item>
        <Filters
          columns={columns}
          tableFilters={filters}
          setFilters={tableActions?.table.filter}
        />
      </Grid>

      <Grid item xs></Grid>

      <Grid item>
        <Typography
          variant="overline"
          component="label"
          htmlFor="outlined-rowHeight-simple"
        >
          Height
        </Typography>
      </Grid>

      <Grid item>
        <TextField
          select
          variant="filled"
          className={classes.formControl}
          value={rowHeight ? rowHeight : 43}
          onChange={event => {
            updateConfig("rowHeight", event.target.value);
          }}
          inputProps={{
            name: "rowHeight",
            id: "outlined-rowHeight-simple",
          }}
          margin="dense"
          InputProps={{ disableUnderline: true }}
          hiddenLabel
        >
          <MenuItem value={43}>Tall</MenuItem>
          <MenuItem value={65}>Grande</MenuItem>
          <MenuItem value={100}>Venti</MenuItem>
          <MenuItem value={150}>Trenta</MenuItem>
          {rowHeight !== 43 &&
            rowHeight !== 65 &&
            rowHeight !== 100 &&
            rowHeight !== 150 && <MenuItem value={rowHeight}>Custom</MenuItem>}
        </TextField>
      </Grid>

      <Grid item />

      <Grid item>
        <ImportCSV />
      </Grid>

      <Grid item>
        <ExportCSV
          columns={columns.map((column: any) => {
            const { key, name, config, type } = column;
            return { key, name, config, type };
          })}
          collection={collection}
          filters={filters}
        />
      </Grid>
    </Grid>
  );
};
export default TableHeader;
