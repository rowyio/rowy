import { IDisplayCellProps } from "@src/components/fields/types";
import { Link } from "react-router-dom";

import { IconButton, Stack, useTheme } from "@mui/material";
import OpenIcon from "@mui/icons-material/OpenInBrowser";

export default function Array({ value }: IDisplayCellProps) {
  const theme = useTheme();

  if (!value) {
    return null;
  }

  return (
    <div
      style={{
        width: "100%",
        maxHeight: "100%",
        whiteSpace: "pre-wrap",
        lineHeight: theme.typography.body2.lineHeight,
        fontFamily: theme.typography.fontFamilyMono,
      }}
    >
      {JSON.stringify(value, null, 4)}
    </div>
  );
}
