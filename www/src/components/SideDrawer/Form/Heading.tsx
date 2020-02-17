import React from "react";
import {
  makeStyles,
  createStyles,
  Typography,
  Divider,
} from "@material-ui/core";

const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      marginTop: theme.spacing(2),
      marginBottom: -theme.spacing(2),
      textTransform: "uppercase",
    },
  })
);

const Heading: React.FunctionComponent = ({ children }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant="h6" color="textSecondary">
        {children}
      </Typography>
      <Divider />
    </div>
  );
};

export default Heading;
