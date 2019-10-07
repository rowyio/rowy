import React, { useEffect, useState } from "react";
import { SketchPicker } from "react-color";
import Popper from "@material-ui/core/Popper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import ExpandIcon from "@material-ui/icons/AspectRatio";
import IconButton from "@material-ui/core/IconButton";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: "relative",
      display: "flex",
      flexWrap: "wrap",
    },
  })
);
// TODO: Create an interface for props

interface Props {
  value: number;
  row: { id: string };
  onSubmit: Function;
  isScrolling: boolean;
}
const Rating = (props: Props) => {
  const { value, onSubmit } = props;
  const [text, setText] = useState(value ? value : "");
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

  const open = Boolean(anchorEl);
  const id = open ? "no-transition-popper" : undefined;
  const onClickAway = (event: any) => {
    if (event.target.id !== id && open) {
      onSubmit(text);
      setAnchorEl(null);
    }
  };
  return (
    <div className={classes.root}>
      <ClickAwayListener onClickAway={onClickAway}>
        <div>
          <IconButton onClick={handleClick}>
            <ExpandIcon />
          </IconButton>
          {text}
          <Popper id={id} open={open} anchorEl={anchorEl}>
            <SketchPicker />
          </Popper>
        </div>
      </ClickAwayListener>
    </div>
  );
};
export default Rating;
