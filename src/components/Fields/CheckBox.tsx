import React, { useState } from "react";
import Checkbox, { CheckboxProps } from "@material-ui/core/Checkbox";

import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CheckBoxOutlineIcon from "@material-ui/icons/CheckBoxOutlineBlank";

const CheckBox = (props: any) => {
  const { columnData, cellData, cellActions, rowData, rowIndex } = props;
  return (
    <Checkbox
      checked={cellData}
      onChange={e => {
        cellActions.updateFirestore({
          rowIndex,
          value: !cellData,
          docId: rowData.id,
          fieldName: columnData.fieldName
        });
      }}
    />
  );
};
export default CheckBox;
