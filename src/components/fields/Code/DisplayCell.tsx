import { IDisplayCellProps } from "@src/components/fields/types";

import { useTheme } from "@mui/material";

export default function Code({ value }: IDisplayCellProps) {
  const theme = useTheme();

  if (typeof value !== "string") return null;

  return (
    <div
      style={{
        width: "100%",
        maxHeight: "100%",
        padding: "3px 0",

        whiteSpace: "pre-wrap",
        lineHeight: theme.typography.body2.lineHeight,
        fontFamily: theme.typography.fontFamilyMono,
        wordBreak: "break-word",
        tabSize: 2,
      }}
    >
      {value.substring(0, 1000)}
    </div>
  );
}
