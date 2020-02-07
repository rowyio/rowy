import React, { useContext } from "react";
import clsx from "clsx";

import { makeStyles, createStyles } from "@material-ui/core/styles";

import EditorContext from "contexts/editorContext";
import { FieldType } from "constants/fields";

const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      height: "1.25em",
      "& > *:first-child": { marginTop: 0 },
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
    <div
      onDoubleClick={() => {
        editorContext.open(props, FieldType.richText);
      }}
      dangerouslySetInnerHTML={{ __html: value }}
      className={clsx("rendered-html", classes.root)}
    />
  );
};
export default RichText;
