import SvgIcon, { SvgIconProps } from "@mui/material/SvgIcon";
import { mdiNumeric } from "@mdi/js";

export default function Number(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path d={mdiNumeric} />
    </SvgIcon>
  );
}
