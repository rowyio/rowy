import { IHeavyCellProps } from "../types";

import { Stack } from "@mui/material";

import ActionFab from "./ActionFab";
import { sanitiseCallableName, isUrl } from "@src/utils/fns";

export default function Action({
  column,
  row,
  value,
  onSubmit,
  disabled,
}: IHeavyCellProps) {
  const hasRan = value && ![null, undefined].includes(value.status);

  return (
    <Stack
      direction="row"
      alignItems="center"
      className="cell-collapse-padding"
      sx={{ padding: "var(--cell-padding)", pr: 0.5 }}
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
      />
    </Stack>
  );
}
