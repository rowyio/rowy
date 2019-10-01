import React, { useState, useEffect } from "react";
import SearchIcon from "@material-ui/icons/Search";
import IconButton from "@material-ui/core/IconButton";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { TextField } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Chip from "@material-ui/core/Chip";

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
  const {
    value,
    row,
    onSubmit,
    collectionPath,
    isScrolling,
    config,
    setSearch,
  } = props;

  const classes = useStyles();

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setSearch((oldValues: any) => ({
      ...oldValues,
      collection: collectionPath,
      config: config,
      onSubmit: (value: any) => {
        onSubmit([value]);
      },
    }));
  };

  return (
    <div className={classes.root}>
      <IconButton onClick={handleClick}>
        <SearchIcon />
      </IconButton>
      {value &&
        value.map((doc: any) => (
          <Chip
            label={config.primaryKeys.map(
              (key: any) => `${doc.snapshot[key]} `
            )}
            //onClick={handleClick}
            //onDelete={handleDelete}
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
