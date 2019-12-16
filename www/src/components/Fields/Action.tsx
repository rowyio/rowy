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
  value: any;
  fieldName: string;
  // row: {
  //   ref: firebase.firestore.DocumentReference;
  //   id: string;
  //   createdAt: any;
  //   rowHeight: number;
  //   updatedAt: any;
  // };
  row: any;
  onSubmit: Function;
}
export default function Action(props: Props) {
  const { row, value, fieldName, onSubmit } = props;
  const { createdAt, updatedAt, rowHeight, id, ref, ...docData } = row;
  const classes = useStyles();
  const handleClick = () => {
    const fieldsToSync = [
      "firstName",
      "lastName",
      "preferredName",
      "personalBio",
      "founderType",
      "cohort",
      "ordering",
      "email",
      "profilePhoto",
      "twitter",
      "employerLogos",
      "linkedin",
      "publicProfile",
      "companies",
    ];
    const data = fieldsToSync.reduce((acc: any, curr: string) => {
      if (row[curr]) {
        acc[curr] = row[curr];
        return acc;
      } else return acc;
    }, {});
    db.collection(fieldName)
      .doc(id)
      .set(data, { merge: true });
    onSubmit(true);
  };
  return (
    <Button
      variant="outlined"
      onClick={handleClick}
      color="primary"
      className={classes.button}
      //   disabled={!!value}
    >
      {value ? `done` : `Create in ${fieldName}`}
    </Button>
  );
}
