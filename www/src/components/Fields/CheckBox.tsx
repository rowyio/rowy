import React from "react";

import Checkbox from "@material-ui/core/Checkbox";

// TODO: Create an interface for props
interface Props {
  value: boolean | null;
  row: { ref: firebase.firestore.DocumentReference; id: string };
  column: { editable: Boolean };
  onSubmit: Function;
}

const CheckBox = (props: Props) => {
  const { value, row, onSubmit, column } = props;
  return (
    <Checkbox
      disabled={!column.editable}
      name={`checkBox-controlled-${row.id}`}
      checked={!!value}
      onChange={e => {
        onSubmit(!value);
      }}
    />
  );
};

export default CheckBox;
