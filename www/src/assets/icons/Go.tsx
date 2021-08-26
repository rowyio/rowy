import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import { SvgIconProps } from "@material-ui/core/SvgIcon";

/** Right chevron icon with optical alignment */
export default function Go(props: SvgIconProps) {
  return <ChevronRightIcon style={{ marginLeft: "-0.33em" }} {...props} />;
}
