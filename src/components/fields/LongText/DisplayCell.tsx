import { IDisplayCellProps } from "@src/components/fields/types";

import { useTheme } from "@mui/material";

export default function LongText({ value }: IDisplayCellProps) {
  const theme = useTheme();

  return (
    <div
      style={{
        maxHeight: "100%",
        padding: "3px 0",

        whiteSpace: "pre-line",
        lineHeight: theme.typography.body2.lineHeight,
      }}
    >
      {value}
    </div>
  );
}
