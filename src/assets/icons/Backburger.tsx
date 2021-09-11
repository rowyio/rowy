import SvgIcon, { SvgIconProps } from "@mui/material/SvgIcon";
import { mdiBackburger } from "@mdi/js";

export default function Backburger(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path d={mdiBackburger} />
    </SvgIcon>
  );
}
