import SvgIcon, { SvgIconProps } from "@mui/material/SvgIcon";
import { mdiCodeJson } from "@mdi/js";

export default function Json(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path d={mdiCodeJson} />
    </SvgIcon>
  );
}
