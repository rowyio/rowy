import React from "react";
import { Column } from "react-data-grid";

import {
  makeStyles,
  createStyles,
  Tooltip,
  Grid,
  IconButton,
} from "@material-ui/core";
import AddColumnIcon from "assets/icons/AddColumn";

import { useFiretableContext } from "contexts/firetableContext";

const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      height: "100%",
      "& svg, & button": { display: "block" },
    },

    addColumnButton: {
      backgroundColor: theme.palette.primary.contrastText,
      padding: 0,
      "& svg": { width: 32, height: 32 },

      opacity: 0.5,
      transition: theme.transitions.create("opacity", {
        duration: theme.transitions.duration.short,
      }),
      "&:hover": {
        backgroundColor: theme.palette.primary.contrastText,
        opacity: 1,
      },
    },
  })
);

const FinalColumnHeader: Column<any>["headerRenderer"] = ({ column }) => {
  const classes = useStyles();

  const { setSelectedColumnHeader } = useFiretableContext();
  if (!setSelectedColumnHeader) return null;

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => setSelectedColumnHeader({ column, anchorEl: event.currentTarget });

  return (
    <Grid
      container
      alignItems="center"
      justify="center"
      className={classes.root}
    >
      <Tooltip title="Add column">
        <IconButton
          size="small"
          className={classes.addColumnButton}
          color="primary"
          aria-label="Add column"
          onClick={handleClick}
        >
          <AddColumnIcon />
        </IconButton>
      </Tooltip>
    </Grid>
  );
};

export default FinalColumnHeader;
