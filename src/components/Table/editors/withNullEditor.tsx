import { EditorProps } from "react-data-grid";
import { IHeavyCellProps } from "@src/components/fields/types";

import { getCellValue } from "@src/utils/fns";

/**
 * Allow the cell to be editable, but disable react-data-grid’s default
 * text editor to show.
 *
 * Hides the editor container so the cell below remains editable inline.
 *
 * Use for cells that have inline editing and don’t need to be double-clicked.
 */
export default function withNullEditor(
  HeavyCell?: React.ComponentType<IHeavyCellProps>
) {
  return function NullEditor(props: EditorProps<any, any>) {
    const { row, column } = props;

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
