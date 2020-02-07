import React, { useState, useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";

import { createStyles, makeStyles, TextField } from "@material-ui/core";

const useStyles = makeStyles(theme =>
  createStyles({
    input: {
      ...theme.typography.body2,
      fontSize: "0.75rem",
      color: theme.palette.text.secondary,
    },
  })
);

// TODO: Create an interface for props
// NOTE: THIS IS NOT USED
const Number = (props: any) => {
  const classes = useStyles();
  const { value, onSubmit } = props;

  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    if (value !== localValue) debouncedCallback(localValue);
  }, [localValue]);

  // Debounce callback
  const [debouncedCallback] = useDebouncedCallback(
    value => {
      if (value.includes(".")) {
        onSubmit(parseFloat(value));
      } else onSubmit(parseInt(value));
    },
    // delay in ms
    1100
  );
  return (
    <TextField
      type="number"
      value={localValue}
      onChange={e => {
        setLocalValue(e.target.value);
      }}
      InputProps={{
        disableUnderline: true,
        classes: { input: classes.input },
      }}
    />
  );
  // else return <p>{cellData}</p>;
};
export default Number;
