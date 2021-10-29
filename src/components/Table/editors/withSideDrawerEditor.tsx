import { useEffect } from "react";
import { EditorProps } from "react-data-grid";
import { useProjectContext } from "@src/contexts/ProjectContext";
import { IHeavyCellProps } from "@src/components/fields/types";

import { getCellValue } from "@src/utils/fns";

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
    const { sideDrawerRef } = useProjectContext();

    useEffect(() => {
      if (!sideDrawerRef?.current?.open && sideDrawerRef?.current?.setOpen)
        sideDrawerRef?.current?.setOpen(true);
    }, [column]);

    return HeavyCell ? (
      <div
        style={{
          width: "100%",
          height: "100%",
          padding: "var(--cell-padding)",
          position: "relative",
          overflow: "hidden",
          contain: "strict",
          display: "flex",
          alignItems: "center",
        }}
      >
        <HeavyCell
          {...(props as any)}
          value={getCellValue(row, column.key)}
          name={column.name as string}
          type={(column as any).type}
          docRef={props.row.ref}
          onSubmit={() => {}}
          disabled={props.column.editable === false}
        />
      </div>
    ) : null;
  };
}
