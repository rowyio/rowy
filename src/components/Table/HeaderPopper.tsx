import React from "react";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Popper from "@material-ui/core/Popper";
import Fade from "@material-ui/core/Fade";
import Paper from "@material-ui/core/Paper";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import { TextField, Grid } from "@material-ui/core";
import { FIELDS } from "../Fields";
const useStyles = makeStyles(Theme =>
  createStyles({
    container: {
      padding: 10
    },
    typography: {
      padding: 1
    },
    header: {
      position: "absolute",
      left: 0,
      top: 0
      //zIndex: 100000
    },
    button: {
      // margin: theme.spacing(1)
    },
    root: {
      display: "flex",
      flexWrap: "wrap"
    },
    formControl: {
      margin: Theme.spacing(1),
      minWidth: 120
    },
    selectEmpty: {
      marginTop: Theme.spacing(2)
    }
  })
);
const HeaderPopper = (props: any) => {
  const { anchorEl, column, handleClose } = props;
  console.log(column);
  const [values, setValues] = React.useState({
    age: "",
    name: "hai"
  });
  console.log(props);
  const classes = useStyles();
  function handleChange(
    event: React.ChangeEvent<{ name?: string; value: unknown }>
  ) {
    setValues(oldValues => ({
      ...oldValues,
      [event.target.name as string]: event.target.value
    }));
  }

  if (column) {
    return (
      <Popper
        id={`id-${column.name}`}
        open={!!anchorEl}
        anchorEl={anchorEl}
        transition
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper className={classes.container}>
              <Grid container direction="column">
                <TextField label="Column name" defaultValue={column.name} />
                <FormControl className={classes.formControl}>
                  <InputLabel htmlFor="age-simple">Field Type</InputLabel>
                  <Select
                    value={FIELDS[0].type}
                    onChange={handleChange}
                    inputProps={{
                      name: "age",
                      id: "age-simple"
                    }}
                  >
                    {FIELDS.map((field: any) => {
                      return (
                        <MenuItem value={field.type}>
                          {field.icon} {field.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                  <Button>Add</Button>
                  <Button color="secondary" onClick={handleClose}>
                    cancel
                  </Button>
                </FormControl>
              </Grid>
            </Paper>
          </Fade>
        )}
      </Popper>
    );
  }
  return <div />;
};

export default HeaderPopper;
