import React, { useState } from "react";

import {
  createStyles,
  makeStyles,
  Select,
  Input,
  MenuItem,
  Grid,
  Chip,
} from "@material-ui/core";

const useStyles = makeStyles(theme => createStyles({}));
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

  const { value, row, options, onSubmit } = props;
  const handleChange = (e: any, v: any) => {
    if (!value || !Array.isArray(value)) {
      // creates new array
      onSubmit([v.props.value]);
    } else if (!value.includes(v.props.value)) {
      // adds to array
      onSubmit([...value, v.props.value]);
    } else {
      // removes from array
      let _updatedValues = [...value];
      const index = _updatedValues.indexOf(v.props.value);
      _updatedValues.splice(index, 1);
      onSubmit(_updatedValues);
    }
  };

  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  if (options && options.length !== 0)
    return (
      <Select
        multiple
        value={value && Array.isArray(value) ? value : []}
        onChange={handleChange}
        input={<Input id="select-multiple-chip" />}
        renderValue={selected => (
          <Grid container spacing={1}>
            {(selected as string[]).map(value => (
              <Grid item key={value}>
                <Chip label={value} />
              </Grid>
            ))}
          </Grid>
        )}
        MenuProps={MenuProps}
        disableUnderline
        open={open}
        onClose={handleClose}
        onOpen={handleOpen}
        fullWidth
      >
        {options.map(option => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    );
  else return <>No options set</>;
};
export default MultiSelect;
