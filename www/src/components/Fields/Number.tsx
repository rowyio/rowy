import React, { useState, useEffect } from "react";
import useDebounce, { useDebouncedCallback } from "use-debounce";
import TextField from "@material-ui/core/TextField";

// TODO: Create an interface for props
const Number = (props: any) => {
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
    />
  );
  // else return <p>{cellData}</p>;
};
export default Number;
