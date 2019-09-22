import React from "react";

import { TextField } from "@material-ui/core";

const Number = (props: any) => {
  const { isFocusedCell, cellData, cellActions } = props;
  if (isFocusedCell)
    return (
      <TextField
        autoFocus
        type="number"
        defaultValue={cellData}
        onChange={e => {
          cellActions.update(e.target.value);
        }}
      />
    );
  else return <p>{cellData}</p>;
};
export default Number;
