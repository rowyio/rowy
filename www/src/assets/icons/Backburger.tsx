import SvgIcon, { SvgIconProps } from "@material-ui/core/SvgIcon";
import { mdiBackburger } from "@mdi/js";

export default function Backburger(props: SvgIconProps) {
  return (
    <SvgIcon viewBox="0 0 24 24" {...props}>
      <path d={mdiBackburger} />
    </SvgIcon>
  );
}
