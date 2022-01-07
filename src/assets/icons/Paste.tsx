import SvgIcon, { SvgIconProps } from "@mui/material/SvgIcon";
import { mdiContentPaste } from "@mdi/js";

export default function Paste(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path d={mdiContentPaste} />
    </SvgIcon>
  );
}
