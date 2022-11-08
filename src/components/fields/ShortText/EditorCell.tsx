import type { IEditorCellProps } from "@src/components/fields/types";
import { useSaveOnUnmount } from "@src/hooks/useSaveOnUnmount";

import { InputBase } from "@mui/material";

export default function ShortText({
  column,
  value,
  onSubmit,
  setFocusInsideCell,
}: IEditorCellProps<string>) {
  const [localValue, setLocalValue] = useSaveOnUnmount(value, onSubmit);
  const maxLength = column.config?.maxLength;

  return (
    <InputBase
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      fullWidth
      inputProps={{ maxLength }}
      sx={{
        width: "100%",
        height: "calc(100% - 1px)",
        marginTop: "1px",
        paddingBottom: "1px",

        backgroundColor: "var(--cell-background-color)",
        outline: "inherit",
        outlineOffset: "inherit",

        font: "inherit", // Prevent text jumping
        letterSpacing: "inherit", // Prevent text jumping

        "& .MuiInputBase-input": { p: "var(--cell-padding)" },

        "& textarea.MuiInputBase-input": {
          lineHeight: (theme) => theme.typography.body2.lineHeight,
          maxHeight: "100%",
          boxSizing: "border-box",
          py: 3 / 8,
        },
      }}
      autoFocus
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
          e.stopPropagation();
        }
        if (e.key === "Escape") {
          // Escape removes focus inside cell, this runs before save on unmount
          setLocalValue(value);
        }
        if (e.key === "Enter") {
          // Removes focus from inside cell, triggering save on unmount
          setFocusInsideCell(false);
        }
      }}
      onClick={(e) => e.stopPropagation()}
      onDoubleClick={(e) => e.stopPropagation()}
    />
  );
}
