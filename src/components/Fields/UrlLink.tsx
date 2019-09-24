import React from "react";
import EditIcon from "@material-ui/icons/Edit";
// TODO: regex validating url
// ^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$
interface Props {
  value: string | null;
}

const UrlLink = (props: Props) => {
  const { value } = props;
  return value ? (
    <>
      <EditIcon />
      <a href={value} target="_blank" rel="noopener noreferrer">
        {value}
      </a>
    </>
  ) : null;
};
export default UrlLink;
