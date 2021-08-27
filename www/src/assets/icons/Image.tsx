import SvgIcon, { SvgIconProps } from "@material-ui/core/SvgIcon";
import { mdiImageOutline } from "@mdi/js";

export default function Image(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path d={mdiImageOutline} />
    </SvgIcon>
  );
}
