import React from "react";

import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import * as yup from "yup";

import { makeStyles, createStyles } from "@material-ui/core/styles";
import { FormDialog } from "@antlerengineering/form-builder";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      display: "flex",
      flexWrap: "wrap",
    },
    buttonGrid: { padding: theme.spacing(3, 0) },
    button: { width: 160 },
  })
);
const yupReducer = (validationConfig) => (acc, currKey) => {
  if (validationConfig[currKey] !== null) {
    const args = Array.isArray(validationConfig[currKey])
      ? validationConfig[currKey]
      : [validationConfig[currKey]];
    return acc[currKey](...args);
  } else return acc[currKey]();
};
const yupOrderKeys = (acc, currKey) => {
  if (["string", "array"].includes(currKey)) return [currKey, ...acc];
  else return [...acc, currKey];
};

const validationCompiler = (validation) =>
  Object.keys(validation)
    .reduce(yupOrderKeys, [])
    .reduce(yupReducer(validation), yup);

export default function ParamsDialog({
  column,
  handleRun,
  open,
  handleClose,
}: any) {
  const classes = useStyles();
  const handleSubmit = (values) => {
    handleRun(values);

    handleClose();
  };

  /*
 Refrence fields config  
  const _fields = [{
    type: 'text',
    name: "newCohort",
    label: "New Cohort",
    validation:{string:null,required:'needs to specific the cohort to new cohort'},
  },
  {
    type: 'multiSelect',
    name: "newCohortSelect",
    label: "New Cohort",
    options: ['SYD1','SYD3'],
    validation:{array:null,required:'needs to specific the cohort to new cohort',max:[1,'only one cohort is allowed']},
  }]
*/

  console.log(column.config.params);
  const fields = column.config.params.map((field) => ({
    ...field,
    validation: validationCompiler(field.validation),
  }));
  console.log(fields);
  return (
    <>
      <FormDialog
        onClose={handleClose}
        open={open}
        title={`${column.name}`}
        fields={fields}
        values={{}}
        onSubmit={handleSubmit}
        customActions={
          <Grid
            container
            spacing={2}
            justify="center"
            className={classes.buttonGrid}
          >
            <Grid item>
              <Button
                size="large"
                variant="outlined"
                onClick={handleClose}
                className={classes.button}
              >
                Cancel
              </Button>
            </Grid>
            <Grid item>
              <Button
                size="large"
                variant="contained"
                type="submit"
                className={classes.button}
              >
                Run
              </Button>
            </Grid>
          </Grid>
        }
      />
    </>
  );
}
