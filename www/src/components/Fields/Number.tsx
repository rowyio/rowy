import React, { useState, useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";

import { createStyles, makeStyles } from "@material-ui/core";

const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      border: "none",
      outline: "none",
      backgroundColor: "transparent",

      font: "inherit",
      color: "inherit",
    },
  })
);

// TODO: Create an interface for props
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
    <input
      type="number"
      value={localValue}
      onChange={e => {
        setLocalValue(e.target.value);
      }}
      className={classes.root}
    />
  );
};
export default Number;
