import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { EditorProps } from "react-data-grid";
import { get } from "lodash-es";

import { tableScope, sideDrawerOpenAtom } from "@src/atoms/tableScope";
import { IHeavyCellProps } from "@src/components/fields/types";

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

    const setSideDrawerOpen = useSetAtom(sideDrawerOpenAtom, tableScope);
    useEffect(() => {
      setSideDrawerOpen(true);
    }, [setSideDrawerOpen]);

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
          value={get(row, column.key)}
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
