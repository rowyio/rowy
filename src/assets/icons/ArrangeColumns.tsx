import SvgIcon, { SvgIconProps } from "@mui/material/SvgIcon";
import { mdiReorderVertical } from "@mdi/js";

export default function ArrangeColumns(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path d={mdiReorderVertical} />
    </SvgIcon>
  );
}
