import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { db } from "../../firebase";
import useDoc from "hooks/useDoc";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      margin: theme.spacing(1),
    },
    input: {
      display: "none",
    },
  })
);
interface Props {
  value: boolean | null;
  fieldName: string;
  row: {
    ref: firebase.firestore.DocumentReference;
    id: string;
    createdAt: any;
    rowHeight: number;
  };
  onSubmit: Function;
}
export default function Action(props: Props) {
  //console.log(props);
  const { row, value, fieldName, onSubmit } = props;
  const { createdAt, rowHeight, id, ref, ...docData } = row;
  //const rowDataToSync: any = { ...docData };
  //const [docState, docDispatch] = useDoc({ path: `${fieldName}/${id}` });
  //console.log("docState", docState);
  const classes = useStyles();

  const handleClick = () => {
    onSubmit(true);
    if (value) {
      db.collection(fieldName)
        .doc(id)
        .update({ ...docData });
    } else
      db.collection(fieldName)
        .doc(id)
        .set({ ...docData, createdAt: new Date() }, { merge: true });
  };
  return (
    <Button
      variant="outlined"
      onClick={handleClick}
      color="primary"
      className={classes.button}
      // disabled={
      //   !rowDataToSync &&
      //   Object.keys(rowDataToSync).every(
      //     (key: string) =>
      //       rowDataToSync[key] !== null &&
      //       rowDataToSync[key] === docState.doc[key]
      //   )
      // }
    >
      {value ? `Sync to ${fieldName}` : `Create in ${fieldName}`}
    </Button>
  );
}
