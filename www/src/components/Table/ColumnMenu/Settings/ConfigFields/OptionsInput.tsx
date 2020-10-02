import React, { useEffect, useState } from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import _includes from "lodash/includes";
import _camelCase from "lodash/camelCase";

import AddIcon from "@material-ui/icons/AddCircle";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
const useStyles = makeStyles((Theme) =>
  createStyles({
    root: {},
    field: {
      width: "100%",
    },
    chipsContainer: {
      display: "flex",
      flexWrap: "wrap",
      maxWidth: "95%",
      padding: Theme.spacing(1),
    },
    chip: {
      margin: Theme.spacing(0.5),
    },
  })
);

export default function OptionsInput(props: any) {
  const { options, handleChange } = props;
  const classes = useStyles();
  const [newOption, setNewOption] = useState("");
  const handleAdd = () => {
    // setOptions([...options, newOption]);
    if (newOption.trim() !== "") {
      handleChange([...options, newOption.trim()]);
      setNewOption("");
    }
  };
  const handleDelete = (optionToDelete: string) => () =>
    handleChange(options.filter((option: string) => option !== optionToDelete));

  return (
    <Grid container direction="column" className={classes.root}>
      <Grid item>
        <TextField
          value={newOption}
          className={classes.field}
          label={props.placeholder ?? "New Option"}
          onChange={(e) => {
            setNewOption(e.target.value);
          }}
          onKeyPress={(e: any) => {
            if (e.key === "Enter") {
              handleAdd();
            }
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  edge="end"
                  aria-label="add new"
                  onClick={(e: any) => {
                    handleAdd();
                  }}
                >
                  {<AddIcon />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      <Grid item className={classes.chipsContainer}>
        {options.map((option: string) => {
          return (
            <Chip
              key={option}
              label={option}
              onDelete={handleDelete(option)}
              className={classes.chip}
            />
          );
        })}
      </Grid>
    </Grid>
  );
}
