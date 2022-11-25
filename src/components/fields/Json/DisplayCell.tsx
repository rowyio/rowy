import stringify from "json-stable-stringify-without-jsonify";
import { IDisplayCellProps } from "@src/components/fields/types";

import { useTheme } from "@mui/material";

export default function Json({ value }: IDisplayCellProps) {
  const theme = useTheme();

  if (!value) return null;

  const formattedJson = stringify(value, { space: 2 }).substring(0, 1000);

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
      }}
    >
      {formattedJson}
    </div>
  );
}
