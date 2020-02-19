import React, { useContext } from "react";

import { Grid } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";

import EditorContext from "contexts/editorContext";
import { FieldType } from "constants/fields";

interface Props {
  value: any;
  row: {
    ref: firebase.firestore.DocumentReference;
    id: string;
    rowHeight: number;
  };
  onSubmit: Function;
}

const LongText = (props: Props) => {
  const editorContext = useContext(EditorContext);
  const { value, row } = props;

  return (
    <Grid
      container
      onDoubleClick={() => {
        editorContext.open(props, FieldType.longText);
      }}
      spacing={1}
      alignItems="center"
      style={{ marginTop: 0 }}
    >
      <Grid item>
        <EditIcon />
      </Grid>
      <Grid
        item
        xs
        style={{
          width: "calc(100% - 24px - 8px)",
          maxHeight: row.rowHeight,
          whiteSpace: "pre-line",
        }}
      >
        {value}
      </Grid>
    </Grid>
  );
};
export default LongText;
