import React from "react";

import { TextField } from "@material-ui/core";

// TODO: Create an interface for props
const SimpleText = (props: any) => {
  const { isFocusedCell, cellData, cellActions } = props;

  if (isFocusedCell)
    return (
      <TextField
        autoFocus
        defaultValue={cellData}
        onChange={e => {
          cellActions.update(e.target.value);
        }}
      />
    );
  else return <p>{cellData}</p>;
};
export default SimpleText;
