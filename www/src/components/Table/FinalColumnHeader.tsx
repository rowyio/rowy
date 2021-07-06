import { Column } from "react-data-grid";

import { makeStyles, createStyles, Grid, Button } from "@material-ui/core";
import AddColumnIcon from "assets/icons/AddColumn";

import { useFiretableContext } from "contexts/FiretableContext";

const useStyles = makeStyles(() =>
  createStyles({
    "@global": {
      ".rdg-header-row .rdg-cell.final-column-header": {
        border: "none",

        "&::before": {
          content: "''",
          display: "block",
          width: 46,
          height: "100%",

          position: "absolute",
          top: 0,
          left: 0,

          border: "1px solid var(--border-color)",
          borderLeftWidth: 0,
        },
      },
    },

    root: {
      height: "100%",
      width: "auto",
    },

    button: { zIndex: 1 },
  })
);

const FinalColumnHeader: Column<any>["headerRenderer"] = ({ column }) => {
  const classes = useStyles();

  const { columnMenuRef } = useFiretableContext();
  if (!columnMenuRef) return null;

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) =>
    columnMenuRef?.current?.setSelectedColumnHeader({
      column,
      anchorEl: event.currentTarget,
    });

  return (
    <Grid
      container
      alignItems="center"
      justify="center"
      className={classes.root}
    >
      <Button
        onClick={handleClick}
        variant="contained"
        color="primary"
        className={classes.button}
        startIcon={<AddColumnIcon />}
      >
        Add Column
      </Button>
    </Grid>
  );
};

export default FinalColumnHeader;
