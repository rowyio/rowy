import stringify from "json-stable-stringify-without-jsonify";
import { IBasicCellProps } from "../types";

import { useTheme } from "@mui/material";

export default function Json({ value }: IBasicCellProps) {
  const theme = useTheme();

  if (!value) return null;

  const formattedJson = stringify(value, { space: 2 });

  return (
    <div
      style={{
        width: "100%",
        maxHeight: "100%",
        padding: theme.spacing(3 / 8, 0),

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
