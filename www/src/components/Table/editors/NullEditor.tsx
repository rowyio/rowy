import React from "react";
import { EditorProps } from "react-data-grid";
import _findIndex from "lodash/findIndex";

import { makeStyles, createStyles } from "@material-ui/core";
const useStyles = makeStyles(
  createStyles({
    "@global": {
      ".rdg-editor-container": { display: "none" },
    },
  })
);

/**
 * Allow the cell to be editable, but disable react-data-grid’s default
 * text editor to show.
 *
 * Hides the editor container so the cell below remains editable inline.
 *
 * Use for cells that have inline editing and don’t need to be double-clicked.
 */
const NullEditor = React.forwardRef((props: EditorProps<any, any>, ref) => {
  useStyles();
  return null;
});

export default NullEditor;
