import SvgIcon, { SvgIconProps } from "@mui/material/SvgIcon";
import { mdiFirebase } from '@mdi/js';

export default function AddColumn(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path d={mdiFirebase} />
    </SvgIcon>
  );
}
