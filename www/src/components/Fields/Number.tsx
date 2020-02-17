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

  const [localValue, setLocalValue] = useState<number>(value);
  const [debouncedValue] = useDebounce<number>(localValue, 1000);

  useEffect(() => {
    if (value !== debouncedValue) onSubmit(debouncedValue);
  }, [debouncedValue]);

  return (
    <input
      type="number"
      value={localValue}
      onChange={e => {
        setLocalValue(Number(e.target.value));
      }}
      className={classes.root}
    />
  );
}
