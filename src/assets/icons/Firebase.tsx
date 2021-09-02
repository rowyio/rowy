import SvgIcon, { SvgIconProps } from "@material-ui/core/SvgIcon";
import { mdiFirebase } from '@mdi/js';

export default function AddColumn(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path d={mdiFirebase} />
    </SvgIcon>
  );
}
