import SvgIcon, { SvgIconProps } from "@material-ui/core/SvgIcon";
import { mdiUpload } from "@mdi/js";

export default function FileUpload(props: SvgIconProps) {
  return (
    <SvgIcon viewBox="0 0 24 24" {...props}>
      <path d={mdiUpload} />
    </SvgIcon>
  );
}
