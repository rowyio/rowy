import React, { useEffect } from "react";
import { EditorProps } from "react-data-grid";
import _findIndex from "lodash/findIndex";
import { useFiretableContext } from "contexts/firetableContext";

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
 * text editor to show. Opens the side drawer in the appropriate position.
 *
 * Hides the editor container so the cell below remains interactive inline.
 *
 * Use for cells that do not support any type of in-cell editing.
 */
const SideDrawerEditor = React.forwardRef(
  ({ column, rowData }: EditorProps<any, any>, ref) => {
    useStyles();
    const { sideDrawerOpen, setSideDrawerOpen } = useFiretableContext();

    useEffect(() => {
      if (!sideDrawerOpen && setSideDrawerOpen) setSideDrawerOpen(true);
    }, [column?.key, rowData?.id]);

    return null;
  }
);

export default SideDrawerEditor;
