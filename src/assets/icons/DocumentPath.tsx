import SvgIcon, { SvgIconProps } from "@mui/material/SvgIcon";
import { mdiFileFindOutline } from "@mdi/js";

export default function DocumentPath(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path d={mdiFileFindOutline} />
    </SvgIcon>
  );
}
