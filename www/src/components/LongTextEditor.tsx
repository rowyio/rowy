import React, { useContext } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import EditorContext from "contexts/editorContext";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import { FieldType } from "./Fields";
import EditorModel from "./EditorModal";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    test: { position: "absolute", top: 10, left: 10 },
    modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      maxWidth: 600,
      width: "100%",
    },
    paper: { padding: theme.spacing(2) },
    root: {
      position: "relative",
      display: "flex",
      flexWrap: "wrap",
    },
    typography: {
      padding: theme.spacing(2),
    },
    textArea: {
      fontSize: 16,
      minWidth: 230,
      width: "100%",
    },
  })
);
interface Props {}

const LongTextEditor = (props: Props) => {
  const classes = useStyles();
  const editorContext = useContext(EditorContext);
  if (editorContext.fieldType !== FieldType.longText) return <></>;
  return (
    <EditorModel>
      <TextareaAutosize
        id={"TextareaAutosize"}
        className={classes.textArea}
        rowsMax={25}
        aria-label="maximum height"
        placeholder="enter text"
        defaultValue={editorContext.editorValue}
        autoFocus
        onChange={(e: any) => {
          editorContext.setEditorValue(e.target.value);
        }}
      />
    </EditorModel>
  );
};
export default LongTextEditor;
