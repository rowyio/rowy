import type { IEditorCellProps } from "@src/components/fields/types";
import { InputBase, InputBaseProps } from "@mui/material";
import { spreadSx } from "@src/utils/ui";

export interface IEditorCellTextFieldProps extends IEditorCellProps<string> {
  InputProps?: Partial<InputBaseProps>;
  onBlur?: () => void;
}

export default function EditorCellTextField({
  column,
  value,
  onDirty,
  onChange,
  onBlur,
  setFocusInsideCell,
  InputProps = {},
}: IEditorCellTextFieldProps) {
  const maxLength = column.config?.maxLength;

  return (
    <InputBase
      value={value}
      onBlur={() => {
        if (onBlur) {
          onBlur();
        }
        onDirty();
      }}
      onChange={(e) => onChange(e.target.value)}
      fullWidth
      autoFocus
      onKeyDown={(e) => {
        if (
          e.key === "ArrowLeft" ||
          e.key === "ArrowRight" ||
          e.key === "ArrowUp" ||
          e.key === "ArrowDown"
        ) {
          e.stopPropagation();
        }
        // Escape prevents saving the new value
        if (e.key === "Escape") {
          // Setting isDirty to false prevents saving
          onDirty(false);
          // Stop propagation to prevent the table from closing the editor
          e.stopPropagation();
          // Close the editor after isDirty is set to false again
          setTimeout(() => setFocusInsideCell(false));
        }
        if (e.key === "Enter" && !e.shiftKey) {
          // Trigger an onBlur in case we have any final mutations
          if (onBlur) {
            onBlur();
          }

          // Removes focus from inside cell, triggering save on unmount
          setFocusInsideCell(false);
        }
      }}
      onClick={(e) => e.stopPropagation()}
      onDoubleClick={(e) => e.stopPropagation()}
      {...InputProps}
      inputProps={{ maxLength, ...InputProps.inputProps }}
      sx={[
        {
          width: "100%",
          height: "calc(100% - 1px)",
          marginTop: "1px",
          padding: 0,
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
            py: 2 / 8,
          },
        },
        ...spreadSx(InputProps.sx),
      ]}
    />
  );
}
