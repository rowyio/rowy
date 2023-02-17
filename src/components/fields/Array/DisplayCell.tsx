import { useTheme } from "@mui/material";
import { IDisplayCellProps } from "@src/components/fields/types";

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
