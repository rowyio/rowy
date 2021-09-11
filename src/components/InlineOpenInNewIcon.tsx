import { SvgIconProps } from "@mui/material/SvgIcon";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

export default function InlineOpenInNewIcon(props: SvgIconProps) {
  return (
    <OpenInNewIcon
      aria-label="Open in new tab"
      {...props}
      sx={{ fontSize: 16, verticalAlign: "text-bottom", ml: 0.5, ...props.sx }}
    />
  );
}
