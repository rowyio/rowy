import SvgIcon, { SvgIconProps } from "@material-ui/core/SvgIcon";
import { mdiPulse } from "@mdi/js";

export default function Status(props: SvgIconProps) {
  return (
    <SvgIcon viewBox="0 0 24 24" {...props}>
      <path d={mdiPulse} />
    </SvgIcon>
  );
}
