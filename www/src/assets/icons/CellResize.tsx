import SvgIcon, { SvgIconProps } from "@material-ui/core/SvgIcon";
import { mdiArrowSplitVertical } from "@mdi/js";

export default function CellResize(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path d={mdiArrowSplitVertical} />
    </SvgIcon>
  );
}
