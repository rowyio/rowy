import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { SvgIconProps } from "@mui/material/SvgIcon";

/** Right chevron icon with optical alignment */
export default function Go(props: SvgIconProps) {
  return <ChevronRightIcon style={{ marginLeft: "-0.33em" }} {...props} />;
}
