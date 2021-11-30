import SvgIcon, { SvgIconProps } from "@mui/material/SvgIcon";
import { mdiClockEditOutline } from "@mdi/js";

export default function UpdatedAt(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path d={mdiClockEditOutline} />
    </SvgIcon>
  );
}
