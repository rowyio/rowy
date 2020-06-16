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
import { FieldType } from "constants/fields";

export const TABLE_HEADER_HEIGHT = 56;

const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      width: `calc(100% - ${DRAWER_COLLAPSED_WIDTH}px)`,
      margin: 0,
      padding: theme.spacing(0, 3.5, 0, 1),
      minHeight: TABLE_HEADER_HEIGHT,

      overflowX: "auto",
      whiteSpace: "nowrap",

      [theme.breakpoints.down("sm")]: {
        width: "100%",
        paddingRight: theme.spacing(1),
      },
    },
    collectionName: { textTransform: "uppercase" },

    spacer: { minWidth: theme.spacing(8) },

    formControl: {
      minWidth: 120,
      margin: theme.spacing(0, 0, 0, -1),
    },
    inputBaseRoot: { borderRadius: theme.shape.borderRadius },
    select: {
      paddingTop: "6px !important",
      paddingBottom: "7px !important",
    },
  })
);

interface ITableHeaderProps {
  collection: string;
  rowHeight: number;
  updateConfig: Function;

  columns: any;
  filters: FireTableFilter[];
}

/**
 * TODO: Make this properly mobile responsive, not just horizontally scrolling
 */
export default function TableHeader({
  collection,
  rowHeight,
  updateConfig,
  columns,
  filters,
}: ITableHeaderProps) {
  const classes = useStyles();
  const { tableActions, userClaims } = useFiretableContext();

  return (
    <Grid
      container
      alignItems="center"
      spacing={2}
      wrap="nowrap"
      className={classes.root}
    >
      <Grid item>
        <Button
          onClick={() => {
            const initialVal = columns.reduce((acc, currCol) => {
              if (currCol.type === FieldType.checkbox) {
                return { ...acc, [currCol.key]: false };
              } else {
                return acc;
              }
            }, {});
            tableActions?.row.add(initialVal);
          }}
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

      <Grid item xs className={classes.spacer} />

      <Grid item>
        <Typography variant="overline" component="label" htmlFor="rowHeight">
          Height
        </Typography>
      </Grid>

      <Grid item>
        <TextField
          select
          variant="filled"
          className={classes.formControl}
          value={rowHeight ?? 43}
          onChange={event => {
            updateConfig("rowHeight", event.target.value);
          }}
          inputProps={{
            name: "rowHeight",
            id: "rowHeight",
          }}
          margin="dense"
          InputProps={{
            disableUnderline: true,
            classes: { root: classes.inputBaseRoot },
          }}
          SelectProps={{
            classes: { root: classes.select },
            displayEmpty: true,
          }}
          hiddenLabel
        >
          <MenuItem value={43}>Tall</MenuItem>
          <MenuItem value={65}>Grande</MenuItem>
          <MenuItem value={100}>Venti</MenuItem>
          <MenuItem value={150}>Trenta</MenuItem>
        </TextField>
      </Grid>

      <Grid item />

      {userClaims && userClaims.roles?.includes("ADMIN") && (
        <Grid item>
          <ImportCSV />
        </Grid>
      )}
      {userClaims && !userClaims.roles?.includes("READONLY") && (
        <Grid item>
          <ExportCSV />
        </Grid>
      )}
    </Grid>
  );
}
