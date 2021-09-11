import SvgIcon, { SvgIconProps } from "@mui/material/SvgIcon";
import { mdiTableColumnPlusBefore } from "@mdi/js";

export default function ColumnPlusBefore(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path d={mdiTableColumnPlusBefore} />
    </SvgIcon>
  );
}
