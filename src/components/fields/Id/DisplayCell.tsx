import { IDisplayCellProps } from "@src/components/fields/types";

import { useTheme } from "@mui/material";

export default function Id({ _rowy_ref }: IDisplayCellProps) {
  const theme = useTheme();

  return (
    <span
      style={{
        fontFamily: theme.typography.fontFamilyMono,
        fontFeatureSettings: "normal",
        userSelect: "all",
      }}
    >
      {_rowy_ref?.id}
    </span>
  );
}
