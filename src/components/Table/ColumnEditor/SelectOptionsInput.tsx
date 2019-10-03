import React, { useEffect, useState } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import _includes from "lodash/includes";
import _camelCase from "lodash/camelCase";

import AddIcon from "@material-ui/icons/AddCircle";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
const useStyles = makeStyles(Theme =>
  createStyles({
    root: {},
    field: {
      width: "100%",
    },
    chipsContainer: {
      display: "flex",
      justifyContent: "center",
      flexWrap: "wrap",
      maxWidth: 300,
      padding: Theme.spacing(1),
    },
    chip: {
      margin: Theme.spacing(0.5),
    },
  })
);

export default function SelectOptionsInput(props: any) {
  const { options, setValue } = props;
  const classes = useStyles();
  const [newOption, setNewOption] = useState("");
  const handleAdd = () => {
    // setOptions([...options, newOption]);
    if (newOption !== "") {
      setValue("options", [...options, newOption]);
      setNewOption("");
    }
  };
  const handleDelete = (optionToDelete: string) => () => {
    const newOptions = options.filter(
      (option: string) => option !== optionToDelete
    );
    setValue("options", newOptions);
  };

  useEffect(() => {
    setValue({ data: { options } });
  }, [options]);

  return (
    <Grid container direction="column" className={classes.root}>
      <Grid item>
        <TextField
          value={newOption}
          className={classes.field}
          label="New Option"
          onChange={e => {
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
                  aria-label="toggle password visibility"
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
