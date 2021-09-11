import SvgIcon, { SvgIconProps } from "@mui/material/SvgIcon";
import { mdiPuzzleOutline } from "@mdi/js";

export default function Extension(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path d={mdiPuzzleOutline} />
    </SvgIcon>
  );
}
