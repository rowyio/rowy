import React, { useContext } from "react";
import ExpandIcon from "@material-ui/icons/AspectRatio";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import EditorContext from "contexts/editorContext";
import { FieldType } from ".";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: "relative",
      display: "flex",
      flexWrap: "wrap",
    },
    typography: {
      position: "relative",
      marginTop: 15,
      maxWidth: "calc(100% - 80px)",
      wordWrap: "break-word",
    },
  })
);
interface Props {
  value: any;
  row: { ref: firebase.firestore.DocumentReference; id: string };
  onSubmit: Function;
}

const RichText = (props: Props) => {
  const editorContext = useContext(EditorContext);
  const { value } = props;
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <IconButton
        onClick={() => {
          editorContext.open(props, FieldType.richText);
        }}
      >
        <ExpandIcon />
      </IconButton>
      <Typography className={classes.typography}>{value}</Typography>
    </div>
  );
};
export default RichText;
