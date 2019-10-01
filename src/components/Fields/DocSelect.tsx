import React, { useState, useEffect } from "react";
import SearchIcon from "@material-ui/icons/Search";
import IconButton from "@material-ui/core/IconButton";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { TextField } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: "relative",
      display: "flex",
      flexWrap: "wrap",
    },
    typography: {
      padding: theme.spacing(2),
    },
    textArea: {
      fontSize: 14,
      minWidth: 230,
    },
    paper: { minWidth: 200 },
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
      anchorEl: event.currentTarget,
      onSubmit: onSubmit,
    }));
  };
  // if (isScrolling) return <div />;

  return (
    <div className={classes.root}>
      <IconButton onClick={handleClick}>
        <SearchIcon />
      </IconButton>
      <Typography>test</Typography>
    </div>
  );
};

export default DocSelect;
