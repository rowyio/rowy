import React, { useContext } from "react";
import clsx from "clsx";

import { makeStyles, createStyles, Grid } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";

import EditorContext from "contexts/editorContext";
import { FieldType } from "constants/fields";

const useStyles = makeStyles(theme =>
  createStyles({
    renderedHtmlContainer: {
      maxWidth: "calc(100% - 24px - 8px)",
    },
    renderedHtml: {
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
    <Grid
      container
      onDoubleClick={() => {
        editorContext.open(props, FieldType.richText);
      }}
      spacing={1}
    >
      <Grid item>
        <EditIcon />
      </Grid>
      <Grid item xs className={classes.renderedHtmlContainer}>
        <div
          dangerouslySetInnerHTML={{ __html: value }}
          className={clsx("rendered-html", classes.renderedHtml)}
        />
      </Grid>
    </Grid>
  );
};
export default RichText;
