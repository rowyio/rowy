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
  //value: boolean | { seconds: number; nanoseconds: number } | null;
  value: any;
  fieldName: string;
  row: {
    ref: firebase.firestore.DocumentReference;
    id: string;
    createdAt: any;
    rowHeight: number;
    updatedAt: any;
  };
  onSubmit: Function;
}
export default function Action(props: Props) {
  const { row, value, fieldName, onSubmit } = props;
  const { createdAt, updatedAt, rowHeight, id, ref, ...docData } = row;

  let needsToSync = true;

  if (
    value &&
    updatedAt &&
    value.seconds &&
    updatedAt.seconds &&
    value.seconds + 20 > updatedAt.seconds
  ) {
    console.log(value, updatedAt);
    needsToSync = false;
  }
  const classes = useStyles();

  const handleClick = () => {
    const now = new Date();
    onSubmit(now);

    db.collection(fieldName)
      .doc(id)
      .set({ ...docData, createdAt: now, updatedAt: now }, { merge: true });
  };
  return (
    <Button
      variant="outlined"
      onClick={handleClick}
      color="primary"
      className={classes.button}
      disabled={!needsToSync}
    >
      {value ? `Sync to ${fieldName}` : `Create in ${fieldName}`}
    </Button>
  );
}
