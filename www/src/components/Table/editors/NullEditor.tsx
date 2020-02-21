import React from "react";
import { EditorProps } from "react-data-grid";
import _findIndex from "lodash/findIndex";

/**
 * Allow the cell to be editable, but disable react-data-grid’s default
 * text editor to show.
 *
 * Displays the same cell selection UI so it looks nearly seamless.
 *
 * Use for cells that have inline editing and don’t need to be double-clicked.
 */
const NullEditor = React.forwardRef((props: EditorProps<any, any>, ref) => (
  <div
    className="rdg-cell-mask rdg-selected"
    style={{ width: "100%", height: "100%" }}
  />
));

export default NullEditor;
