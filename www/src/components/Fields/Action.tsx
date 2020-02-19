import React, { useContext } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { SnackContext } from "../../contexts/snackContext";
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import PlayIcon from "@material-ui/icons/PlayCircleOutline";
import ReplayIcon from "@material-ui/icons/Replay";
import { cloudFunction } from "../../firebase/callables";

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
  callableName: string;
  // row: {
  //   ref: firebase.firestore.DocumentReference;
  //   id: string;
  //   createdAt: any;
  //   rowHeight: number;
  //   updatedAt: any;
  // };
  row: any;
  scripts: any;
  onSubmit: Function;
}
export default function Action(props: Props) {
  const { row, value, fieldName, onSubmit, scripts, callableName } = props;
  const { createdAt, updatedAt, rowHeight, id, ref, ...docData } = row;

  const snack = useContext(SnackContext);
  const handleRun = () => {
    // eval(scripts.onClick)(row);
    const cleanRow = Object.keys(row).reduce((acc: any, key: string) => {
      if (row[key]) return { ...acc, [key]: row[key] };
      else return acc;
    }, {});
    cleanRow.ref = "cleanRow.ref";
    delete cleanRow.rowHeight;
    delete cleanRow.updatedFields;
    cloudFunction(
      callableName,
      {
        ref: {
          path: ref.path,
          id: ref.id,
        },
        row: docData,
      },
      response => {
        const { message, cellValue } = response.data;
        snack.open({ message, severity: "success" });
        if (cellValue) {
          onSubmit(cellValue);
        }
      },
      o => snack.open({ message: JSON.stringify(o), severity: "error" })
    );
  };
  const classes = useStyles();
  if (value && value.status)
    return (
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
      >
        <Typography variant="body1"> {value.status}</Typography>
        <IconButton onClick={handleRun} disabled={!value.redo}>
          <ReplayIcon />
        </IconButton>
      </Grid>
    );
  else
    return (
      <Grid
        container
        direction="row"
        justify="space-between"
        alignContent="center"
      >
        <Typography variant="body1">
          {callableName?.replace("callable-", "").replace(/([A-Z])/g, " $1")}
        </Typography>
        <IconButton onClick={handleRun}>
          <PlayIcon />
        </IconButton>
      </Grid>
    );
}
