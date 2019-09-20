import React from "react";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Popper from "@material-ui/core/Popper";
import Fade from "@material-ui/core/Fade";
import Paper from "@material-ui/core/Paper";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
const useStyles = makeStyles(Theme =>
  createStyles({
    typography: {
      padding: 1
    },
    header: {
      position: "absolute",
      left: 0,
      top: 0
      //zIndex: 100000
    },
    button: {
      // margin: theme.spacing(1)
    }
  })
);
const HeaderPopper = (props: any) => {
  const { anchorEl } = props;
  const classes = useStyles();
  return (
    <Popper id={"id"} open={!!anchorEl} anchorEl={anchorEl} transition>
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={350}>
          <Paper>
            <Typography className={classes.typography}>
              The content of the Popper.
            </Typography>
          </Paper>
        </Fade>
      )}
    </Popper>
  );
};

export default HeaderPopper;
