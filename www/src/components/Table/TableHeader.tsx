import React from "react";
import useRouter from "../../hooks/useRouter";
import queryString from "query-string";

import {
  makeStyles,
  createStyles,
  Grid,
  FormControl,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  Link,
  Breadcrumbs,
  Typography,
  Button,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/AddCircle";

import ImportCSV from "../ImportCSV";
import ExportCSV from "../ExportCSV";

import { FireTableFilter } from "../../hooks/useFiretable";
import { DRAWER_COLLAPSED_WIDTH } from "components/SideDrawer";

import Filters from "./Filters";
const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      width: `calc(100% - ${DRAWER_COLLAPSED_WIDTH}px)`,
      margin: 0,
      padding: theme.spacing(0, 1),
      minHeight: 56,
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
  tableActions: any;
  addRow: Function;
  columns: any;
  filters: FireTableFilter[];
}
const TableHeader = ({
  collection,
  rowHeight,
  updateConfig,
  columns,
  addRow,
  filters,
  tableActions,
}: Props) => {
  const classes = useStyles();
  const router = useRouter();
  const parentLabel = queryString.parse(router.location.search)
    .parentLabel as string;
  let breadcrumbs = collection.split("/");

  return (
    <Grid container alignItems="center" spacing={2} className={classes.root}>
      <Grid item xs>
        {breadcrumbs.length === 1 ? (
          <Typography variant="h6" className={classes.collectionName}>
            {" "}
            {collection.replace(/([A-Z])/g, " $1")}
          </Typography>
        ) : (
          <Breadcrumbs aria-label="breadcrumb">
            {breadcrumbs.map((crumb: string, index) => {
              if (index % 2 === 0)
                return (
                  <Link
                    color="inherit"
                    href={`/table/${breadcrumbs
                      .reduce((acc: string, curr: string, currIndex) => {
                        if (currIndex < index + 1) return acc + "/" + curr;
                        else return acc;
                      }, " ")
                      .replace(" /", "")}?parentLabel=${parentLabel
                      .split(",")
                      .reduce((acc: string, curr, currIndex) => {
                        if (currIndex > index - 1) return acc + "," + curr;
                        else return acc;
                      }, " ")
                      .replace(" ,", "")}`}
                  >
                    {crumb.replace(/([A-Z])/g, " $1")}
                  </Link>
                );
              else if (index % 2 === 1)
                return (
                  <Typography variant="h6">
                    {parentLabel.split(",")[Math.ceil(index / 2) - 1]}
                  </Typography>
                );
              else
                return (
                  <Typography variant="h6">
                    {" "}
                    {crumb.replace(/([A-Z])/g, " $1")}
                  </Typography>
                );
            })}
          </Breadcrumbs>
        )}
      </Grid>

      <Grid item>
        <Grid container spacing={1} alignItems="center">
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
              value={rowHeight ? rowHeight : 35}
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
              <MenuItem value={35}>Tall</MenuItem>
              <MenuItem value={60}>Grande</MenuItem>
              <MenuItem value={100}>Venti</MenuItem>
              <MenuItem value={150}>Trenta</MenuItem>
            </TextField>
          </Grid>

          <Grid item>
            <Filters
              columns={columns}
              tableFilters={filters}
              setFilters={tableActions.table.filter}
            />
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

          <Grid item>
            <ImportCSV columns={columns} addRow={addRow} />
          </Grid>

          <Grid item>
            <Button onClick={() => addRow()} endIcon={<AddIcon />}>
              Add Row
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
export default TableHeader;
