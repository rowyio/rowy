import React from "react";
import TextField from "@material-ui/core/TextField";
const Number = (props: any) => {
  const { value, cellActions } = props;
  return (
    <TextField
      autoFocus
      type="number"
      defaultValue={value}
      onChange={e => {}}
    />
  );
  // else return <p>{cellData}</p>;
};
export default Number;
