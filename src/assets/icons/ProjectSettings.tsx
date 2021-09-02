import SvgIcon, { SvgIconProps } from "@material-ui/core/SvgIcon";
import { mdiWrenchOutline } from "@mdi/js";

export default function ProjectSettings(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path d={mdiWrenchOutline} />
    </SvgIcon>
  );
}
