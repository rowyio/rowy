import React from "react";

import TextField from "@material-ui/core/TextField";

// TODO: Create an interface for props
const Number = (props: any) => {
  const { value } = props;
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
