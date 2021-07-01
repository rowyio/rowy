import { IHeavyCellProps } from "../types";

import { useTheme } from "@material-ui/core";

export default function Id({ docRef }: IHeavyCellProps) {
  const theme = useTheme();

  return (
    <span
      style={{ fontFamily: theme.typography.fontFamilyMono, userSelect: "all" }}
    >
      {docRef.id}
    </span>
  );
}
