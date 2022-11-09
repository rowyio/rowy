import { IEditorCellProps } from "@src/components/fields/types";

import { Stack } from "@mui/material";

import ActionFab from "./ActionFab";
import { sanitiseCallableName, isUrl } from "./utils";

export default function Action({
  column,
  row,
  value,
  onSubmit,
  disabled,
  tabIndex,
}: IEditorCellProps) {
  const hasRan = value && ![null, undefined].includes(value.status);

  return (
    <Stack
      direction="row"
      alignItems="center"
      sx={{ padding: "var(--cell-padding)", pr: 0.5, width: "100%" }}
    >
      <div style={{ flexGrow: 1, overflow: "hidden" }}>
        {hasRan && isUrl(value.status) ? (
          <a href={value.status} target="_blank" rel="noopener noreferrer">
            {value.status}
          </a>
        ) : hasRan ? (
          value.status
        ) : (
          sanitiseCallableName(column.key)
        )}
      </div>

      <ActionFab
        row={row}
        column={column}
        onSubmit={onSubmit}
        value={value}
        disabled={disabled}
        tabIndex={tabIndex}
      />
    </Stack>
  );
}
