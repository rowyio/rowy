import React from "react";
import EditIcon from "@material-ui/icons/Edit";
// TODO: regex validating url
// ^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$

const UrlLink = (props: any) => {
  const { value, cellActions } = props;
  return value ? (
    <>
      <EditIcon />
      <a href={value} target="_blank">
        {value}
      </a>
    </>
  ) : null;
};
export default UrlLink;
