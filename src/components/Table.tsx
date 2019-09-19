import React from "react";
import ReactDataGrid from "react-data-grid";
import useFiretable from "../hooks/useFiretable";
import Button from "@material-ui/core/Button";
import Popper, { PopperPlacementType } from "@material-ui/core/Popper";
import Typography from "@material-ui/core/Typography";
import Fade from "@material-ui/core/Fade";
import Paper from "@material-ui/core/Paper";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(Theme =>
  createStyles({
    typography: {
      padding: 1
    },
    header: {
      position: "absolute",
      left: 0,
      top: 0,
      zIndex: 1000000
    }
  })
);

function Table(props: any) {
  const { collection } = props;
  const { tableState, tableActions } = useFiretable(collection);
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const [open, setOpen] = React.useState(false);
  const [placement, setPlacement] = React.useState<PopperPlacementType>();

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setAnchorEl(event.currentTarget);
    setOpen(!open);
  };

  const onGridRowsUpdated = (props: any) => {
    const { fromRowData, updated } = props;
    fromRowData.ref.update(updated);
  };

  const headerRenderer = (props: any) => {
    return (
      <div className={classes.header}>
        <Button
          aria-describedby={props.column.key}
          variant="contained"
          onClick={handleClick}
        >
          {props.column.name}
        </Button>
      </div>
    );
  };
  if (tableState.columns) {
    const columns = tableState.columns.map((column: any) => ({
      key: column.fieldName,
      name: column.columnName,
      editable: true,
      resizeable: true,
      frozen: column.fieldName === "cohort",
      headerRenderer: headerRenderer,
      width: 200
    }));
    const rows = tableState.rows;
    return (
      <>
        <ReactDataGrid
          columns={columns}
          rowGetter={i => rows[i]}
          rowsCount={rows.length}
          onGridRowsUpdated={onGridRowsUpdated}
          enableCellSelect={true}
        />
        <Popper id={"id"} open={open} anchorEl={anchorEl} transition>
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              <Paper>
                <Typography className={classes.typography}>
                  The content of the Popper.
                </Typography>
              </Paper>
            </Fade>
          )}
        </Popper>
      </>
    );
  } else return <p>Loading</p>;
}

export default Table;
