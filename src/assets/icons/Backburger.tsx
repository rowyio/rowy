import SvgIcon, { SvgIconProps } from "@material-ui/core/SvgIcon";
import { mdiBackburger } from "@mdi/js";

export default function Backburger(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path d={mdiBackburger} />
    </SvgIcon>
  );
}
