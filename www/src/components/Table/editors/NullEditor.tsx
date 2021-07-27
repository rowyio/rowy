import React from "react";
import { EditorProps } from "react-data-grid";
// import _findIndex from "lodash/findIndex";

import { withStyles, WithStyles } from "@material-ui/core";
import styles from "./styles";

/**
 * Allow the cell to be editable, but disable react-data-grid’s default
 * text editor to show.
 *
 * Hides the editor container so the cell below remains editable inline.
 *
 * Use for cells that have inline editing and don’t need to be double-clicked.
 *
 * TODO: fix NullEditor overwriting the formatter component
 */
class NullEditor extends React.Component<
  EditorProps<any, any> & WithStyles<typeof styles>
> {
  getInputNode = () => null;
  getValue = () => null;
  render = () => null;
}

export default withStyles(styles)(NullEditor);
