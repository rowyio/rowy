import SvgIcon, { SvgIconProps } from "@material-ui/core/SvgIcon";
import { mdiCircleHalfFull } from "@mdi/js";

export default function DarkTheme(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path d={mdiCircleHalfFull} />
    </SvgIcon>
  );
}
