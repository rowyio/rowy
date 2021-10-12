import SvgIcon, { SvgIconProps } from "@mui/material/SvgIcon";
import { mdiAccountEditOutline } from "@mdi/js";

export default function UpdatedBy(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path d={mdiAccountEditOutline} />
    </SvgIcon>
  );
}
