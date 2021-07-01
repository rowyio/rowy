import SvgIcon, { SvgIconProps } from "@material-ui/core/SvgIcon";
import { mdiNumeric } from "@mdi/js";

export default function Number(props: SvgIconProps) {
  return (
    <SvgIcon viewBox="0 0 24 24" {...props}>
      <path d={mdiNumeric} />
    </SvgIcon>
  );
}
