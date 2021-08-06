import { makeStyles, createStyles } from "@material-ui/styles";
import { Grid, Button } from "@material-ui/core";

import { isCollectionGroup } from "utils/fns";
import AddRowIcon from "assets/icons/AddRow";

import Filters from "../Filters";
import ImportCSV from "./ImportCsv";
import Export from "./Export";
import TableSettings from "./TableSettings";
import TableLogs from "./TableLogs";
import HiddenFields from "../HiddenFields";
import RowHeight from "./RowHeight";
import Sparks from "./Sparks";
import ReExecute from "./ReExecute";

import { useAppContext } from "contexts/AppContext";
import { useFiretableContext, firetableUser } from "contexts/FiretableContext";
import { FieldType } from "constants/fields";

export const TABLE_HEADER_HEIGHT = 56;

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      width: "100%",
      margin: 0,
      padding: theme.spacing(0, 1.25, 1.5, 0.5),
      minHeight: TABLE_HEADER_HEIGHT,

      overflowX: "auto",
      whiteSpace: "nowrap",

      userSelect: "none",

      [theme.breakpoints.down("md")]: {
        width: "100%",
        paddingRight: theme.spacing(1),
      },

      "& > *": { paddingTop: "0 !important" },
    },

    addRowIcon: {
      fontSize: "26px !important",
      marginTop: -1,
      marginBottom: -1,
    },

    spacer: { minWidth: theme.spacing(8) },
  })
);

/**
 * TODO: Make this properly mobile responsive, not just horizontally scrolling
 */
export default function TableHeader() {
  const classes = useStyles();

  const { currentUser } = useAppContext();
  const { tableActions, tableState, userClaims } = useFiretableContext();

  const hasDerivatives =
    tableState &&
    Object.values(tableState.columns)?.filter(
      (column) => column.type === FieldType.derivative
    ).length > 0;
  const hasSparks =
    tableState && tableState.config?.sparks?.replace(/\W/g, "")?.length > 0;

  if (!tableState || !tableState.columns) return null;
  const { columns } = tableState;
  return (
    <Grid
      container
      alignItems="center"
      spacing={1.5}
      wrap="nowrap"
      className={classes.root}
    >
      {!isCollectionGroup() && (
        <Grid item>
          <Button
            onClick={() => {
              const requiredFields = Object.values(columns)
                .map((column) => {
                  if (column.config.required) {
                    return column.key;
                  }
                })
                .filter((c) => c);
              const initialVal = Object.values(columns).reduce(
                (acc, column) => {
                  if (column.config?.defaultValue?.type === "static") {
                    return {
                      ...acc,
                      [column.key]: column.config.defaultValue.value,
                    };
                  } else if (column.config?.defaultValue?.type === "null") {
                    return { ...acc, [column.key]: null };
                  } else return acc;
                },
                {}
              );
              tableActions?.row.add(
                {
                  ...initialVal,
                  _ft_updatedBy: firetableUser(currentUser),
                  _ft_createdBy: firetableUser(currentUser),
                },
                requiredFields
              );
            }}
            variant="contained"
            color="primary"
            startIcon={<AddRowIcon className={classes.addRowIcon} />}
          >
            Add Row
          </Button>
        </Grid>
      )}

      {/* Spacer */}
      <Grid item />

      <Grid item>
        <HiddenFields />
      </Grid>
      <Grid item>
        <Filters />
      </Grid>

      <Grid item xs className={classes.spacer} />

      <Grid item>
        <RowHeight />
      </Grid>

      {/* Spacer */}
      <Grid item />

      {!isCollectionGroup() && (
        <Grid item>
          <ImportCSV />
        </Grid>
      )}

      <Grid item>
        <Export />
      </Grid>

      {userClaims?.roles?.includes("ADMIN") && (
        <Grid item>
          <Sparks />
        </Grid>
      )}

      {userClaims?.roles?.includes("ADMIN") && (
        <Grid item>
          <TableLogs />
        </Grid>
      )}

      {userClaims?.roles?.includes("ADMIN") && (hasDerivatives || hasSparks) && (
        <Grid item>
          <ReExecute />
        </Grid>
      )}

      <Grid item>
        <TableSettings />
      </Grid>
    </Grid>
  );
}
