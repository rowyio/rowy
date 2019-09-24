import React from "react";
import ExpandIcon from "@material-ui/icons/AspectRatio";
import IconButton from "@material-ui/core/IconButton";

interface Props {
  value: string | null;
}

const UrlLink = (props: Props) => {
  const { value } = props;
  return value ? (
    <>
      <IconButton>
        <ExpandIcon />
      </IconButton>
      <p>{value}</p>
    </>
  ) : null;
};
export default UrlLink;
