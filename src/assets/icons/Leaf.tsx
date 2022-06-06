import SvgIcon, { SvgIconProps } from "@mui/material/SvgIcon";
import { mdiLeaf } from "@mdi/js";

export default function Leaf(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path d={mdiLeaf} />
    </SvgIcon>
  );
}
