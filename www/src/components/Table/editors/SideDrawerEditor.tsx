import React, { useEffect } from "react";
import { EditorProps } from "react-data-grid";
import _findIndex from "lodash/findIndex";
import { useFiretableContext } from "contexts/firetableContext";

import { makeStyles } from "@material-ui/core";
import styles from "./styles";

const useStyles = makeStyles(styles);

/**
 * Allow the cell to be editable, but disable react-data-grid’s default
 * text editor to show. Opens the side drawer in the appropriate position.
 *
 * Hides the editor container so the cell below remains interactive inline.
 *
 * Use for cells that do not support any type of in-cell editing.
 */
function SideDrawerEditor_(props: EditorProps<any, any>) {
  useStyles();

  const {
    column, // rowData
  } = props;
  const rowData = {};
  const { sideDrawerRef } = useFiretableContext();

  useEffect(() => {
    if (!sideDrawerRef?.current?.open && sideDrawerRef?.current?.setOpen)
      sideDrawerRef?.current?.setOpen(true);
  }, [column, rowData]);

  return null;
}

/**
 * react-data-grid requires the Editor component to be a class component
 * with getInputNode and getValue methods.
 */
class SideDrawerEditor extends React.Component<EditorProps<any, any>> {
  getInputNode = () => null;
  getValue = () => null;
  render = () => <SideDrawerEditor_ {...this.props} />;
}

export default SideDrawerEditor;
