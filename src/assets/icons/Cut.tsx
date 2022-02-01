import SvgIcon, { SvgIconProps } from "@mui/material/SvgIcon";
import { mdiContentCut } from "@mdi/js";

export default function Cut(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path d={mdiContentCut} />
    </SvgIcon>
  );
}
