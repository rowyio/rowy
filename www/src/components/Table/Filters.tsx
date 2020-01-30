import React from "react";

import {
  Button,
  Paper,
  Typography,
  IconButton,
  FormControl,
  Grid,
  Select,
  MenuItem,
} from "@material-ui/core";
import FilterIcon from "@material-ui/icons/FilterList";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Popper from "@material-ui/core/Popper";
import CloseIcon from "@material-ui/icons/Close";

{
  /* <, <=, ==, >, >=, array-contains, in, or array-contains-any */
}

const OPERATORS = [
  { value: "==", label: "equals" },
  { value: "in", label: "is on of" },
  { value: "array-contains", label: "has" },
  { value: "array-contains-any", label: "Has any" },
  { value: "<", label: "Less than" },
  { value: "<=", label: "less or equal to" },
  { value: ">=", label: "at least" },
  { value: ">", label: "More than" },
];

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      padding: theme.spacing(2),
      width: 640,
    },
    close: {
      position: "absolute",
      right: 0,
    },
    content: {
      padding: theme.spacing(3),
    },
    formControl: {},
    filterType: {
      display: "flex",
      alignContent: "center",
    },
    filterTypeSelect: {
      margin: theme.spacing(0, 1),
      height: 50,
    },
    footer: {
      position: "absolute",
      bottom: 0,
    },
  })
);

const Filters = (Props: any) => {
  //const filters = [{}, {}];
  const classes = useStyles();
  const filters = [];
  const combineType = "all";
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);

  const id = open ? "simple-popper" : undefined;
  return (
    <>
      <Button variant="outlined" color="primary" onClick={handleClick}>
        <FilterIcon /> {filters.length !== 0 && filters.length}
        {` Filters`}
      </Button>
      <Popper id={id} open={open} anchorEl={anchorEl}>
        <Paper className={classes.paper}>
          <IconButton
            className={classes.close}
            onClick={() => {
              setAnchorEl(null);
            }}
          >
            <CloseIcon />
          </IconButton>
          <div className={classes.content}>
            <div className={classes.filterType}>
              <Typography>Results match </Typography>
              <FormControl variant="filled" className={classes.formControl}>
                <Select
                  className={classes.filterTypeSelect}
                  labelId="demo-simple-select-filled-label"
                  id="demo-simple-select-filled"
                  value={combineType}
                  disabled
                  // onChange={handleChange}
                >
                  <MenuItem value={"all"}>all</MenuItem>
                  <MenuItem value={"any"}>any</MenuItem>
                </Select>
              </FormControl>
              <Typography>of the filter criteria.</Typography>
            </div>

            <Grid container>
              <Grid item xs={4}>
                <Typography variant="overline">Column</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="overline">Condition</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="overline">Value</Typography>
              </Grid>
            </Grid>

            <Grid container>
              <Grid item xs={4}>
                <FormControl
                  variant="filled"
                  className={classes.formControl}
                  fullWidth
                >
                  <Select
                    className={classes.filterTypeSelect}
                    labelId="demo-simple-select-filled-label"
                    id="demo-simple-select-filled"
                    value={combineType}

                    // onChange={handleChange}
                  >
                    <MenuItem value={"firstName"}>firstName</MenuItem>
                    <MenuItem value={"lastName"}>lastName</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControl
                  fullWidth
                  variant="filled"
                  className={classes.formControl}
                >
                  <Select
                    className={classes.filterTypeSelect}
                    labelId="demo-simple-select-filled-label"
                    id="demo-simple-select-filled"
                    value={combineType}
                    // onChange={handleChange}
                  >
                    {OPERATORS.map(operator => (
                      <MenuItem value={operator.value}>
                        {operator.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="overline">Value</Typography>
              </Grid>
            </Grid>
            {/* <Grid container justify="space-between" className={classes.footer}>
              <Button color="primary">+ ADD FILTER</Button>
              <Button color="primary">REMOVE ALL</Button>
            </Grid> */}
          </div>
        </Paper>
      </Popper>
    </>
  );
};

export default Filters;
