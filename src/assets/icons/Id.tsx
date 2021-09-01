import SvgIcon, { SvgIconProps } from "@material-ui/core/SvgIcon";
import { mdiIdentifier } from "@mdi/js";

export default function Id(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path d={mdiIdentifier} />
    </SvgIcon>
  );
}
