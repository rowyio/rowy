import SvgIcon, { SvgIconProps } from "@mui/material/SvgIcon";
import { mdiFormatListBulletedSquare } from "@mdi/js";

export default function MultiSelect(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path d={mdiFormatListBulletedSquare} />
    </SvgIcon>
  );
}
