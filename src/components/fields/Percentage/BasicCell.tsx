import { IBasicCellProps } from "@src/components/fields/types";

import { useTheme } from "@mui/material";

export default function Percentage({ value }: IBasicCellProps) {
  const theme = useTheme();

  if (value === null || value === undefined) return null;

  const percentage = typeof value === "number" ? value : 0;
  return (
    <div
      style={{
        textAlign: "right",
        color: theme.palette.text.primary,
        position: "relative",
        zIndex: 1,
      }}
    >
      {Math.round(percentage * 100)}%
    </div>
  );
}
