import React from "react";
import { ICustomCellProps } from "../types";

import { useTheme } from "@material-ui/core";

export default function Id({ docRef }: ICustomCellProps) {
  const theme = useTheme();

  return (
    <span
      style={{ fontFamily: theme.typography.fontFamilyMono, userSelect: "all" }}
    >
      {docRef.id}
    </span>
  );
}
