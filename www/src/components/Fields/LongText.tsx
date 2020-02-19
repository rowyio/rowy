import React from "react";

import { Grid } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";

import { useFiretableContext } from "contexts/firetableContext";

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
  const { setSideDrawerOpen } = useFiretableContext();
  const { value, row } = props;

  return (
    <Grid
      container
      onDoubleClick={() => {
        if (setSideDrawerOpen) setSideDrawerOpen(true);
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
