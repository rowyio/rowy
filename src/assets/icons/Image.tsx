import SvgIcon, { SvgIconProps } from "@mui/material/SvgIcon";
import { mdiImageOutline } from "@mdi/js";

export default function Image(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path d={mdiImageOutline} />
    </SvgIcon>
  );
}
