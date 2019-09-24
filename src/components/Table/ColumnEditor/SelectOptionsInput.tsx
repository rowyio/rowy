import React, { useEffect } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";
import { TextField, Grid, Divider } from "@material-ui/core";
import _includes from "lodash/includes";
import _camelCase from "lodash/camelCase";

const useStyles = makeStyles(Theme =>
  createStyles({
    root: {
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

  const handleAdd = (newOption: string) => {
    // setOptions([...options, newOption]);
    setValue("options", [...options, newOption]);
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
          label="New Option"
          onKeyPress={(e: any) => {
            const value = e.target.value;
            if (e.key === "Enter") {
              handleAdd(value);
              e.target.value = "";
            }
          }}
        />
      </Grid>
      <Grid item>
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
