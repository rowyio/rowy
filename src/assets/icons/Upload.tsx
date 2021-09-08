import SvgIcon, { SvgIconProps } from "@material-ui/core/SvgIcon";
import { mdiUploadOutline } from "@mdi/js";

export default function Upload(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path d={mdiUploadOutline} />
    </SvgIcon>
  );
}
