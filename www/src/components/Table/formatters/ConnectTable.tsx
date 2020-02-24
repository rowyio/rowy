import React from "react";
import clsx from "clsx";
import withCustomCell, { CustomCellProps } from "./withCustomCell";

import {
  createStyles,
  makeStyles,
  Grid,
  Chip,
  IconButton,
} from "@material-ui/core";

import AddIcon from "@material-ui/icons/AddCircleOutline";

const useStyles = makeStyles(theme =>
  createStyles({
    root: { padding: theme.spacing(0, 0.625, 0, 1) },
    chipList: { overflowX: "hidden" },
  })
);

const ConnectTable = ({ column, value, onSubmit }: CustomCellProps) => {
  const classes = useStyles();

  const { collectionPath, config } = column as any;

  const handleClick = () => {
    // setSearch((oldValues: any) => ({
    //   ...oldValues,
    //   collection: collectionPath,
    //   config: config,
    //   onSubmit: (newItem: any) => {
    //     if (value) onSubmit([...value, newItem]);
    //     else onSubmit([newItem]);
    //   },
    // }));
  };

  const handleDelete = (index: number) => {
    let newValue = [...value];
    newValue.splice(index, 1);
    onSubmit(newValue);
  };

  return (
    <Grid
      container
      alignItems="center"
      spacing={1}
      className={clsx("cell-collapse-padding", classes.root)}
    >
      <Grid item xs className={classes.chipList}>
        <Grid container spacing={1} wrap="nowrap">
          {value &&
            value.map((doc: any, index: number) => (
              <Grid item key={doc.docPath}>
                <Chip
                  label={config.primaryKeys.map(
                    (key: string) => `${doc.snapshot[key]} `
                  )}
                  onDelete={
                    config.isLocked ? undefined : () => handleDelete(index)
                  }
                />
              </Grid>
            ))}
        </Grid>
      </Grid>

      {!config.isLocked && (
        <Grid item>
          <IconButton
            onClick={handleClick}
            size="small"
            className="row-hover-iconButton"
          >
            <AddIcon />
          </IconButton>
        </Grid>
      )}
    </Grid>
  );
};

export default withCustomCell(ConnectTable);
