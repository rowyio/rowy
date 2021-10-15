import SvgIcon, { SvgIconProps } from "@mui/material/SvgIcon";
import { mdiClockPlusOutline } from "@mdi/js";

export default function CreatedAt(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path d={mdiClockPlusOutline} />
    </SvgIcon>
  );
}
