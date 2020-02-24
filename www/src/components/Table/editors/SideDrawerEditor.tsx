import React, { useEffect } from "react";
import { EditorProps } from "react-data-grid";
import _findIndex from "lodash/findIndex";
import { useFiretableContext } from "contexts/firetableContext";

/**
 * Allow the cell to be editable, but disable react-data-grid’s default
 * text editor to show. Opens the side drawer in the appropriate position.
 *
 * Displays the same cell selection UI so it looks nearly seamless.
 *
 * Use for cells that do not support any type of in-cell editing.
 */
const SideDrawerEditor = React.forwardRef(
  ({ column, row }: EditorProps<any, any>, ref) => {
    const { sideDrawerOpen, setSideDrawerOpen } = useFiretableContext();

    useEffect(() => {
      if (!sideDrawerOpen && setSideDrawerOpen) setSideDrawerOpen(true);
    }, [column?.key, row?.id]);

    return (
      <div
        className="rdg-cell-mask rdg-selected"
        style={{ width: "100%", height: "100%" }}
      />
    );
  }
);

export default SideDrawerEditor;
