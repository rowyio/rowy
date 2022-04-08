import SvgIcon, { SvgIconProps } from "@mui/material/SvgIcon";
import { mdiPulse } from "@mdi/js";

export default function Status(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path d={mdiPulse} />
    </SvgIcon>
  );
}
