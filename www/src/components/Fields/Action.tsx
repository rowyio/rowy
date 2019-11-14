import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { db } from "../../firebase";

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
  row: {
    ref: firebase.firestore.DocumentReference;
    id: string;
    createdAt: any;
    rowHeight: number;
  };
  onSubmit: Function;
}
export default function Action(props: Props) {
  const { row, value, onSubmit } = props;
  const classes = useStyles();

  const handleClick = () => {
    const { createdAt, rowHeight, id, ref, ...docData } = row;
    onSubmit(true);
    db.collection("founders")
      .doc(id)
      .set({ ...docData, createdAt: new Date() }, { merge: true });
  };
  return (
    <Button
      variant="outlined"
      onClick={handleClick}
      color="primary"
      className={classes.button}
    >
      {value ? "Sync to founders" : "Create Founder"}
    </Button>
  );
}
