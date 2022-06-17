import { SvgIconProps } from "@mui/material/SvgIcon";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

/** Right chevron icon with optical alignment */
export function Go(props: SvgIconProps) {
  return <ChevronRightIcon style={{ marginLeft: "-0.33em" }} {...props} />;
}
