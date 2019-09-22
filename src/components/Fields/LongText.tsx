import React from "react";
import ExpandIcon from "@material-ui/icons/AspectRatio";
import IconButton from "@material-ui/core/IconButton";

const UrlLink = (props: any) => {
  const { value, cellActions } = props;
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
