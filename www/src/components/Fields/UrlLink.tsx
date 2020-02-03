import React from "react";

import { Grid } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
// TODO: regex validating url
// ^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$
interface Props {
  value: string | null;
}

const UrlLink = (props: Props) => {
  const { value } = props;
  return value ? (
    <Grid
      container
      alignItems="center"
      wrap="nowrap"
      spacing={1}
      style={{ marginTop: 0 }}
    >
      <Grid item>
        <EditIcon />
      </Grid>
      <Grid item xs>
        <a href={value} target="_blank" rel="noopener noreferrer">
          {value}
        </a>
      </Grid>
    </Grid>
  ) : null;
};
export default UrlLink;
