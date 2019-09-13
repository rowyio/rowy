import React, { useState } from "react";
import Checkbox, { CheckboxProps } from "@material-ui/core/Checkbox";

import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CheckBoxOutlineIcon from "@material-ui/icons/CheckBoxOutlineBlank";

const CheckBox = (props: any) => {
  const { isFocusedCell, cellData, cellActions } = props;
  const [state, setState] = useState(cellData);
  if (isFocusedCell)
    return (
      <Checkbox
        checked={state}
        onChange={e => {
          setState(!state);
          cellActions.update(!state);
        }}
      />
    );
  else return cellData === true ? <CheckBoxIcon /> : <CheckBoxOutlineIcon />;
};
export default CheckBox;
