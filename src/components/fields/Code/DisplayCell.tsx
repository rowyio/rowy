import { IDisplayCellProps } from "@src/components/fields/types";

import { useTheme } from "@mui/material";

export default function Code({ value }: IDisplayCellProps) {
  const theme = useTheme();
  return (
    <div
      style={{
        width: "100%",
        maxHeight: "100%",
        padding: theme.spacing(1, 0),

        whiteSpace: "pre-wrap",
        lineHeight: theme.typography.body2.lineHeight,
        fontFamily: theme.typography.fontFamilyMono,
        wordBreak: "break-word",
        tabSize: 2,
      }}
    >
      {value}
    </div>
  );
}
