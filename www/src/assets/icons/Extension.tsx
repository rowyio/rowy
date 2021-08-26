import SvgIcon, { SvgIconProps } from "@material-ui/core/SvgIcon";
import { mdiPuzzleOutline } from "@mdi/js";

export default function Extension(props: SvgIconProps) {
  return (
    <SvgIcon viewBox="0 0 24 24" {...props}>
      <path d={mdiPuzzleOutline} />
    </SvgIcon>
  );
}
