import SvgIcon, { SvgIconProps } from "@mui/material/SvgIcon";
import { mdiResizeBottomRight } from "@mdi/js";

export default function ResizeBottomRight(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path d={mdiResizeBottomRight} />
    </SvgIcon>
  );
}
