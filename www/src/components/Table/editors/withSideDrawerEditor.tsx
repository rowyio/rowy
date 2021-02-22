import React, { useEffect } from "react";
import { EditorProps } from "react-data-grid";
import { useFiretableContext } from "contexts/FiretableContext";
import { IHeavyCellProps } from "components/fields/types";

import { getCellValue } from "utils/fns";

/**
 * Allow the cell to be editable, but disable react-data-grid’s default
 * text editor to show. Opens the side drawer in the appropriate position.
 *
 * Displays the current HeavyCell or HeavyCell since it overwrites cell contents.
 *
 * Use for cells that do not support any type of in-cell editing.
 */
export default function withSideDrawerEditor(
  HeavyCell?: React.ComponentType<IHeavyCellProps>
) {
  return function SideDrawerEditor(props: EditorProps<any, any>) {
    const { row, column } = props;
    const { sideDrawerRef } = useFiretableContext();

    useEffect(() => {
      if (!sideDrawerRef?.current?.open && sideDrawerRef?.current?.setOpen)
        sideDrawerRef?.current?.setOpen(true);
    }, [column]);

    return HeavyCell ? (
      <HeavyCell
        {...(props as any)}
        value={getCellValue(row, column.key)}
        name={column.name}
        type={(column as any).type}
        docRef={props.row.ref}
        onSubmit={() => {}}
        disabled={props.column.editable === false}
      />
    ) : null;
  };
}
