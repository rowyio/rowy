import SvgIcon, { SvgIconProps } from "@material-ui/core/SvgIcon";
import { mdiFileTree } from "@mdi/js";

export default function CloudLogs(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path d={mdiFileTree} />
    </SvgIcon>
  );
}
