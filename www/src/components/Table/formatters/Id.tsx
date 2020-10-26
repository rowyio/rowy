import React from "react";
import { CustomCellProps } from "./withCustomCell";

import { useTheme } from "@material-ui/core";

export default function Percentage({ docRef }: CustomCellProps) {
  const theme = useTheme();

  return (
    <span style={{ fontFamily: theme.typography.fontFamilyMono }}>
      {docRef.id}
    </span>
  );
}
