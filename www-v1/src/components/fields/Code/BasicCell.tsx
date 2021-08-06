import { IBasicCellProps } from "../types";

import { useTheme } from "@material-ui/core";

export default function Code({ value }: IBasicCellProps) {
  const theme = useTheme();

  return (
    <div
      style={{
        width: "100%",
        maxHeight: "100%",
        padding: theme.spacing(0.5, 0),

        whiteSpace: "pre-wrap",
        lineHeight: theme.typography.body2.lineHeight,
        fontFamily: theme.typography.fontFamilyMono,
        wordBreak: "break-word",
      }}
    >
      {value}
    </div>
  );
}
