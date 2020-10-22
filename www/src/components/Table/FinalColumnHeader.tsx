import React from "react";
import { Column } from "react-data-grid";

import { makeStyles, createStyles, Grid, Button } from "@material-ui/core";
import AddColumnIcon from "assets/icons/AddColumn";

import { useFiretableContext } from "contexts/firetableContext";

const useStyles = makeStyles((theme) =>
  createStyles({
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
