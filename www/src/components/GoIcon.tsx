import React from "react";

import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import { SvgIconProps } from "@material-ui/core/SvgIcon";

const GoIcon: React.FunctionComponent<SvgIconProps> = props => (
  <ChevronRightIcon style={{ marginLeft: -8 }} {...props} />
);

export default GoIcon;
