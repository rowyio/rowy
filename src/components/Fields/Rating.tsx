import React from "react";
import MuiRating from "@material-ui/lab/Rating";

const Rating = (props: any) => {
  const { columnData, cellData, cellActions, rowData, rowIndex } = props;
  return (
    <MuiRating
      name={`rating-controlled-${columnData.fieldName}-${rowIndex}`}
      value={cellData}
      onChange={(event, newValue) => {
        const cell = {
          rowIndex,
          value: newValue,
          docRef: rowData.ref,
          fieldName: columnData.fieldName,
        };
        cellActions.updateFirestore(cell);
      }}
    />
  );
};
export default Rating;
