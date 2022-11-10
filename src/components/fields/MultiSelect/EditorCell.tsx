import { IEditorCellProps } from "@src/components/fields/types";

import { Typography, Button } from "@mui/material";
import WarningIcon from "@mui/icons-material/WarningAmber";
import MultiSelectComponent from "@rowy/multiselect";
import EmptyState from "@src/components/EmptyState";

import { sanitiseValue } from "./utils";

export default function MultiSelect({
  value,
  onChange,
  onSubmit,
  column,
  parentRef,
  showPopoverCell,
  disabled,
}: IEditorCellProps) {
  const config = column.config ?? {};

  if (typeof value === "string" && value !== "")
    return (
      <EmptyState
        Icon={WarningIcon}
        message="Fix this value"
        description={
          <>
            <Typography>This cell’s value is a string</Typography>
            <Button
              color="primary"
              onClick={() => {
                onChange([value]);
                onSubmit();
              }}
            >
              Convert to array
            </Button>
          </>
        }
        sx={{ my: 3, width: column.width }}
      />
    );

  return (
    <MultiSelectComponent
      value={sanitiseValue(value)}
      onChange={onChange}
      options={config.options ?? []}
      multiple
      freeText={config.freeText}
      disabled={disabled}
      label={column.name as string}
      labelPlural={column.name as string}
      TextFieldProps={{
        style: { display: "none" },
        SelectProps: {
          open: true,
          MenuProps: {
            anchorEl: parentRef,
            anchorOrigin: { vertical: "bottom", horizontal: "center" },
            transformOrigin: { vertical: "top", horizontal: "center" },
            sx: {
              "& .MuiPaper-root": { minWidth: `${column.width}px !important` },
            },
          },
        },
      }}
      onClose={() => {
        showPopoverCell(false);
        onSubmit();
      }}
    />
  );
}
