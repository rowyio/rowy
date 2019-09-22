import React from "react";

import { Checkbox } from "@material-ui/core";

// TODO: Create an interface for props
const CheckBox = (props: any) => {
  const { value, row, onSubmit } = props;
  return (
    <Checkbox
      name={`checkBox-controlled-${row.id}`}
      checked={value}
      onChange={e => {
        onSubmit(row.ref, !value);
      }}
    />
  );
};

export default CheckBox;
