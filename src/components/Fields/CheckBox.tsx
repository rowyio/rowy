import React from "react";

import { Checkbox } from "@material-ui/core";

// TODO: Create an interface for props
interface Props {
  value: boolean | null;
  row: { ref: firebase.firestore.DocumentReference; id: string };
  onSubmit: Function;
}

const CheckBox = (props: Props) => {
  const { value, row, onSubmit } = props;
  return (
    <Checkbox
      name={`checkBox-controlled-${row.id}`}
      checked={!!value}
      onChange={e => {
        onSubmit(row.ref, !value);
      }}
    />
  );
};

export default CheckBox;
