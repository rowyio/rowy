import React, { useState, useEffect } from "react";
import AddIcon from "@material-ui/icons/AddCircle";
import IconButton from "@material-ui/core/IconButton";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";

const snapshotReducer = (accumulator: string, currentValue: any) => {};
const getPrimaryValue = (config: { primaryKeys: string[] }) => {};
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: "relative",
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
    },
    typography: {
      padding: theme.spacing(2),
    },
    textArea: {
      fontSize: 14,
      minWidth: 230,
    },
    paper: { minWidth: 200 },
    chip: {
      margin: theme.spacing(1),
    },
  })
);
interface Props {
  value: any;
  row: { ref: firebase.firestore.DocumentReference; id: string };
  onSubmit: Function;
  collectionPath: string;
  isScrolling: boolean;
  setSearch: any;
  config: any;
}

const DocSelect = (props: Props) => {
  const { value, row, onSubmit, collectionPath, config, setSearch } = props;
  const classes = useStyles();
  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setSearch((oldValues: any) => ({
      ...oldValues,
      collection: collectionPath,
      config: config,
      onSubmit: (newItem: any) => {
        if (value) onSubmit([...value, newItem]);
        else onSubmit([newItem]);
      },
    }));
  };

  const handleDelete = (index: number) => {
    let newValue = [...value];
    newValue.splice(index, 1);
    onSubmit(newValue);
  };

  return (
    <div className={classes.root}>
      {!config.isLocked && (
        <IconButton onClick={handleClick}>
          <AddIcon />
        </IconButton>
      )}
      {value &&
        value.map((doc: any, index: number) => (
          <Chip
            key={doc.docPath}
            label={config.primaryKeys.map(
              (key: string) => `${doc.snapshot[key]} `
            )}
            //onClick={handleClick}
            onDelete={
              config.isLocked
                ? undefined
                : () => {
                    handleDelete(index);
                  }
            }
            className={classes.chip}
          />
        ))}
      {/* <Typography>
        {value[0]
          ? config.primaryKeys.map((key: any) => `${value[0].snapshot[key]} `)
          : ""}
      </Typography> */}
    </div>
  );
};

export default DocSelect;
