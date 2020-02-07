import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import useRouter from "../../hooks/useRouter";
import OpenIcon from "@material-ui/icons/OpenInNew";
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
  parentLabel: string; // key
  onSubmit: Function;
}
export default function SubTable(props: Props) {
  const { row, value, fieldName, onSubmit, parentLabel } = props;
  console.log(props);
  const { createdAt, updatedAt, rowHeight, id, ref, ...docData } = row;
  const router = useRouter();
  const classes = useStyles();

  const handleClick = () => {
    const subTablePath =
      encodeURIComponent(`${row.ref.path}/${fieldName}`) +
      `?parentLabel=${row[parentLabel]}`;
    console.log(row, subTablePath);
    router.history.push(subTablePath);
  };

  return (
    <Button
      variant="outlined"
      onClick={handleClick}
      color="primary"
      className={classes.button}
      //   disabled={!!value}
    >
      <OpenIcon />
    </Button>
  );
}
