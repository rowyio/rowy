import type { DraggableProvidedDragHandleProps } from "react-beautiful-dnd";
import { DragVertical } from "@src/assets/icons";

export interface IColumnHeaderDragHandleProps {
  dragHandleProps: DraggableProvidedDragHandleProps;
  tabIndex: number;
}

export default function ColumnHeaderDragHandle({
  dragHandleProps,
  tabIndex,
}: IColumnHeaderDragHandleProps) {
  return (
    <div
      {...dragHandleProps}
      tabIndex={tabIndex}
      aria-describedby={
        tabIndex > -1 ? dragHandleProps["aria-describedby"] : undefined
      }
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        display: "flex",
        alignItems: "center",
        outline: "none",
      }}
      className="column-drag-handle"
    >
      <DragVertical
        sx={{
          opacity: 0,
          borderRadius: 2,
          transition: (theme) => theme.transitions.create(["opacity"]),
          "[role='columnheader']:hover &, [role='columnheader']:focus-within &":
            {
              opacity: 0.5,
            },
          ".column-drag-handle:hover &": {
            opacity: 1,
          },
          ".column-drag-handle:active &": {
            opacity: 1,
            color: "primary.main",
          },
          ".column-drag-handle:focus &": {
            opacity: 1,
            color: "primary.main",
            outline: "2px solid",
            outlineColor: "primary.main",
          },
        }}
        style={{ width: 8 }}
        preserveAspectRatio="xMidYMid slice"
      />
    </div>
  );
}
