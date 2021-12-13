import SvgIcon, { SvgIconProps } from "@mui/material/SvgIcon";
import { mdiTableEdit } from "@mdi/js";

export default function ResizeColumn(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path d={mdiTableEdit} />
    </SvgIcon>
  );
}
