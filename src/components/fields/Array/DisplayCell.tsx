import { useTheme } from "@mui/material";
import { IDisplayCellProps } from "@src/components/fields/types";
import { isArray } from "lodash-es";
import { SupportedTypes, detectType } from "./SideDrawerField/SupportedTypes";

export default function Array({ value }: IDisplayCellProps) {
  const theme = useTheme();

  if (!value) {
    return null;
  }
  if (isArray(value)) {
    value = value.map((item: any) => {
      let itemType = detectType(item);
      let converter = SupportedTypes[itemType].humanize;
      if (!converter) return item;
      return converter(item);
    });
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
