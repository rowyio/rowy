import React, { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";

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
export default function _Number(props: any) {
  const classes = useStyles();
  const { value, onSubmit } = props;

  const [localValue, setLocalValue] = useState<number | undefined>(
    value === NaN ? undefined : value
  );
  const [debouncedValue] = useDebounce<number | undefined>(localValue, 1000);

  useEffect(() => {
    if (debouncedValue === undefined || debouncedValue === NaN) return;
    if (value !== debouncedValue) onSubmit(debouncedValue);
  }, [debouncedValue]);

  return (
    <input
      type="number"
      value={localValue === NaN ? undefined : localValue}
      onChange={e => setLocalValue(Number(e.target.value))}
      className={classes.root}
    />
  );
}
