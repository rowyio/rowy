import React from "react";
import SvgIcon, { SvgIconProps } from "@material-ui/core/SvgIcon";
import { mdiGestureTap } from "@mdi/js";

export default function SubTable(props: SvgIconProps) {
  return (
    <SvgIcon viewBox="0 2 24 24" {...props}>
      <path d={mdiGestureTap} />
    </SvgIcon>
  );
}
