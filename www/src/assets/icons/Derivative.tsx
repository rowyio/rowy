import SvgIcon, { SvgIconProps } from "@material-ui/core/SvgIcon";
import { mdiFunctionVariant } from "@mdi/js";

export default function Derivative(props: SvgIconProps) {
  return (
    <SvgIcon viewBox="0 0 24 24" {...props}>
      <path d={mdiFunctionVariant} />
    </SvgIcon>
  );
}
