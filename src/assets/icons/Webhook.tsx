import SvgIcon, { SvgIconProps } from "@mui/material/SvgIcon";
import { mdiWebhook } from "@mdi/js";

export default function Webhook(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path d={mdiWebhook} />
    </SvgIcon>
  );
}
