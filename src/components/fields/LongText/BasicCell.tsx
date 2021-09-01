import { IBasicCellProps } from "../types";

import { useTheme } from "@material-ui/core";

export default function LongText({ value }: IBasicCellProps) {
  const theme = useTheme();

  return (
    <div
      style={{
        width: "100%",
        maxHeight: "100%",
        padding: theme.spacing(0.5, 0),

        whiteSpace: "pre-line",
        lineHeight: theme.typography.body2.lineHeight,
      }}
    >
      {value}
    </div>
  );
}
