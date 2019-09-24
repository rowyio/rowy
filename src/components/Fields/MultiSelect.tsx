import React from "react";
import EditIcon from "@material-ui/icons/Edit";
import WarningIcon from "@material-ui/icons/Warning";
import { Select } from "@material-ui/core";
import {
  createStyles,
  makeStyles,
  useTheme,
  Theme,
} from "@material-ui/core/styles";

import Input from "@material-ui/core/Input";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import Chip from "@material-ui/core/Chip";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexWrap: "wrap",
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
      maxWidth: 300,
    },
    chips: {
      display: "flex",
      flexWrap: "wrap",
    },
    chip: {
      margin: 2,
    },
    noLabel: {
      marginTop: theme.spacing(3),
    },
    noOptions: {
      position: "absolute",
      top: -15,
    },
  })
);
interface Props {
  value: string[] | null;
  row: { ref: firebase.firestore.DocumentReference; id: string };
  options: string[];
  onSubmit: Function;
}
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const MultiSelect = (props: Props) => {
  const classes = useStyles();
  console.log(props);
  const { value, row, options, onSubmit } = props;
  const handleChange = (e: any, v: any) => {
    console.log(v.props.value);
    if (!value) {
      // creates new array
      onSubmit(row.ref, [v.props.value]);
    } else if (!value.includes(v.props.value)) {
      // adds to array
      onSubmit(row.ref, [...value, v.props.value]);
    } else {
      // removes from array
      let _updatedValues = [...value];
      const index = _updatedValues.indexOf(v.props.value);
      _updatedValues.splice(index, 1);
      onSubmit(row.ref, _updatedValues);
    }
  };

  if (options && options.length !== 0)
    return (
      <Select
        multiple
        value={value ? value : []}
        defaultValue={[]}
        onChange={handleChange}
        input={<Input id="select-multiple-chip" />}
        renderValue={selected => (
          <div className={classes.chips}>
            {(selected as string[]).map(value => (
              <Chip key={value} label={value} className={classes.chip} />
            ))}
          </div>
        )}
        MenuProps={MenuProps}
      >
        {options.map(option => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    );
  else
    return (
      <Grid className={classes.noOptions} direction="row">
        {/* <Grid item>
          <WarningIcon />
        </Grid>{" "} */}
        <Grid item>
          <Typography>add options!</Typography>
        </Grid>
      </Grid>
    );
};
export default MultiSelect;
