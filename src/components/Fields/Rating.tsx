import React from "react";
import MuiRating from "@material-ui/lab/Rating";

const Rating = (props: any) => {
  const { columnData, cellData, cellActions, rowData, rowIndex } = props;
  // console.log(columnData, cellData, cellActions, rowData, rowIndex);

  return (
    <MuiRating
      name={`rating-controlled-${columnData.fieldName}-${rowIndex}`}
      value={cellData}
      onChange={(event, newValue) => {
        const cell = {
          rowIndex,
          value: newValue,
          docId: rowData.id,
          fieldName: columnData.fieldName
        };
        cellActions.updateFirestore(cell);
      }}
    />
  );
};
export default Rating;
