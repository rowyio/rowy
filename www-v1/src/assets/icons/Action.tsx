import SvgIcon, { SvgIconProps } from "@material-ui/core/SvgIcon";
import { mdiGestureTap } from "@mdi/js";

export default function Action(props: SvgIconProps) {
  return (
    <SvgIcon viewBox="0 2 24 24" {...props}>
      <path d={mdiGestureTap} />
    </SvgIcon>
  );
}
