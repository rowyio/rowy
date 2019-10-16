import React, { useState, useEffect } from "react";
import ExpandIcon from "@material-ui/icons/AspectRatio";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Popper from "@material-ui/core/Popper";
import Paper from "@material-ui/core/Paper";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: "relative",
      display: "flex",
      flexWrap: "wrap",
    },
    typography: {
      padding: theme.spacing(2),
    },
    textArea: {
      fontSize: 14,
      minWidth: 230,
    },
  })
);
interface Props {
  value: any;
  row: { ref: firebase.firestore.DocumentReference; id: string };
  onSubmit: Function;
}

const LongText = (props: Props) => {
  const { value, onSubmit } = props;
  const [text, setText] = useState(value ? JSON.stringify(value) : "");
  useEffect(() => {
    if (text !== value) setText(value);
  }, [value]);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const classes = useStyles();

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setAnchorEl(event.currentTarget);
  };
  const onClickAway = () => {
    if (text !== value) onSubmit(text);
  };
  const open = anchorEl !== null;
  const id = open ? "no-transition-popper" : undefined;
  return (
    <div className={classes.root}>
      <ClickAwayListener onClickAway={onClickAway}>
        <div>
          <IconButton onClick={handleClick}>
            <ExpandIcon />
          </IconButton>
          {text}
          <Popper id={id} open={open} anchorEl={anchorEl}>
            <Paper>
              <Typography className={classes.typography}>
                <TextareaAutosize
                  id={id}
                  className={classes.textArea}
                  rowsMax={6}
                  aria-label="maximum height"
                  placeholder="enter text"
                  defaultValue={text}
                  autoFocus
                  onChange={(e: any) => {
                    setText(e.target.value);
                  }}
                />
              </Typography>
            </Paper>
          </Popper>
        </div>
      </ClickAwayListener>
    </div>
  );
};
export default LongText;
