import RatingIcon from "@mui/icons-material/Star";
import RatingOutlineIcon from "@mui/icons-material/StarBorder";
import { get } from "lodash-es";

export interface IIconProps {
  config: any;
  isEmpty: boolean;
}

export default function Icon({ config, isEmpty }: IIconProps) {
  if (isEmpty) {
    return getStateOutline(config);
  } else {
    return getStateIcon(config);
  }
}

const getStateIcon = (config: any) => {
  // only use the config to get the custom rating icon if enabled via toggle
  if (!get(config, "customIcons.enabled")) {
    return <RatingIcon />;
  }
  return get(config, "customIcons.rating") || <RatingIcon />;
};
const getStateOutline = (config: any) => {
  if (!get(config, "customIcons.enabled")) {
    return <RatingOutlineIcon />;
  }
  return get(config, "customIcons.rating") || <RatingOutlineIcon />;
};
