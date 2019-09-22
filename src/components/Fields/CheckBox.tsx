import React from "react";

import { Checkbox } from "@material-ui/core";

// TODO: Create an interface for props
const CheckBox = (props: any) => {
  const { columnData, cellData, cellActions, rowData, rowIndex } = props;
  return (
    <Checkbox
      checked={cellData}
      onChange={e => {
        cellActions.updateFirestore({
          rowIndex,
          value: !cellData,
          docRef: rowData.ref,
          fieldName: columnData.fieldName,
        });
      }}
    />
  );
};

export default CheckBox;
