import { IHeavyCellProps } from "../types";

import { useTheme } from "@mui/material";

export default function Id({ docRef }: IHeavyCellProps) {
  const theme = useTheme();

  return (
    <span
      style={{
        fontFamily: theme.typography.fontFamilyMono,
        fontFeatureSettings: "normal",
        userSelect: "all",
      }}
    >
      {docRef.id}
    </span>
  );
}
