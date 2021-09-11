import SvgIcon, { SvgIconProps } from "@mui/material/SvgIcon";
import { mdiTableColumnRemove } from "@mdi/js";

export default function ColumnRemove(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path d={mdiTableColumnRemove} />
    </SvgIcon>
  );
}
