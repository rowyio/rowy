import React from "react";
import { Typography } from "@material-ui/core";

interface IDescriptionProps {
  heading?: React.ReactNode;
  description?: React.ReactNode;
}

const Description: React.FunctionComponent<IDescriptionProps> = ({
  heading,
  description,
}) => (
  <div>
    {heading && (
      <Typography variant="subtitle2" color="textSecondary" gutterBottom>
        {heading}
      </Typography>
    )}

    {description && <Typography variant="body1">{description}</Typography>}
  </div>
);

export default Description;
