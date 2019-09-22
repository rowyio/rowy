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
import { TextField } from "@material-ui/core";
const useStyles = makeStyles(Theme =>
  createStyles({
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
const NewColumnPopper = (props: any) => {
  const { anchorEl, column } = props;
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
  return (
    <Popper id={"id"} open={!!anchorEl} anchorEl={anchorEl} transition>
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={350}>
          <Paper>
            <TextField label="Column name" />
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="age-simple">Age</InputLabel>
              <Select
                value={values.age}
                onChange={handleChange}
                inputProps={{
                  name: "age",
                  id: "age-simple"
                }}
              >
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
            </FormControl>
          </Paper>
        </Fade>
      )}
    </Popper>
  );
};

export default NewColumnPopper;
