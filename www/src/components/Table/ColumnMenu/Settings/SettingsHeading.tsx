import React from "react";

import { useTheme, Typography, TypographyProps } from "@material-ui/core";

export default function SettingsHeading(props: TypographyProps) {
  const theme = useTheme();

  return (
    <Typography
      variant="overline"
      display="block"
      gutterBottom
      {...props}
      style={{
        color: theme.palette.text.disabled,
        marginTop: theme.spacing(4),
        ...props.style,
      }}
    />
  );
}
