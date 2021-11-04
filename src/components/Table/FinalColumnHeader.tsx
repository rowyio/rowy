import { Column } from "react-data-grid";

import { makeStyles, createStyles } from "@mui/styles";
import { Grid, Button } from "@mui/material";
import AddColumnIcon from "@src/assets/icons/AddColumn";

import { useProjectContext } from "@src/contexts/ProjectContext";

const useStyles = makeStyles((theme) =>
  createStyles({
    "@global": {
      ".rdg-header-row .rdg-cell.final-column-header": {
        border: "none",
        ".rdg.rdg &": { padding: theme.spacing(0, 0.75) },

        position: "relative",
        "&::before": {
          content: "''",
          display: "block",
          width: 43,
          height: "100%",

          position: "absolute",
          top: 0,
          left: 0,

          border: "1px solid var(--border-color)",
          borderLeftWidth: 0,
          borderTopRightRadius: theme.shape.borderRadius,
          borderBottomRightRadius: theme.shape.borderRadius,
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

  const { columnMenuRef } = useProjectContext();
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
      justifyContent="center"
      className={classes.root}
    >
      <Button
        onClick={handleClick}
        variant="contained"
        color="primary"
        className={classes.button}
        startIcon={<AddColumnIcon />}
      >
        Add column
      </Button>
    </Grid>
  );
};

export default FinalColumnHeader;
