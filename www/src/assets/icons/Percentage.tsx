import SvgIcon, { SvgIconProps } from "@material-ui/core/SvgIcon";
import { mdiPercent } from "@mdi/js";

export default function Percentage(props: SvgIconProps) {
  return (
    <SvgIcon viewBox="-2 -2 28 28" {...props}>
      <path d={mdiPercent} />
    </SvgIcon>
  );
}
