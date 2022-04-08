import SvgIcon, { SvgIconProps } from "@mui/material/SvgIcon";
import { mdiTableColumnPlusAfter } from "@mdi/js";

export default function ColumnPlusAfter(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path d={mdiTableColumnPlusAfter} />
    </SvgIcon>
  );
}
