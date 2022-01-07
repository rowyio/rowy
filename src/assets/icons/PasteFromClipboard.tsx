import SvgIcon, { SvgIconProps } from "@mui/material/SvgIcon";
import { mdiClipboardArrowDownOutline } from "@mdi/js";

export default function PasteFromClipboard(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path d={mdiClipboardArrowDownOutline} />
    </SvgIcon>
  );
}
