import React, { useEffect, useState } from "react";
import {
  SketchPicker,
  BlockPicker,
  CompactPicker,
  TwitterPicker,
} from "react-color";
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
      alignItems: "center",
    },
    colorIndicator: {
      width: 20,
      height: 20,
      margin: 10,
      backgroundColor: "#fff",
      borderStyle: "solid",
      borderWidth: 0.5,
    },
  })
);
// TODO: Create an interface for props

interface Props {
  value: { hex: string; rgb: any };
  row: { id: string };
  onSubmit: Function;
  isScrolling: boolean;
}
const Color = (props: Props) => {
  const { value, onSubmit } = props;
  const [hex, setHex] = useState(value ? value.hex : "");
  useEffect(() => {
    if (hex !== value.hex) setHex(value.hex);
  }, [value]);
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const classes = useStyles();

  const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ? "no-transition-popper" : undefined;
  const onClickAway = (event: any) => {
    if (event.target.id !== id && open) {
      setAnchorEl(null);
    }
  };
  return (
    <>
      <div className={classes.root}>
        <div
          onClick={handleClick}
          className={classes.colorIndicator}
          style={{ backgroundColor: hex }}
        />{" "}
        {hex}
      </div>
      <Popper id={id} open={open} anchorEl={anchorEl}>
        <CompactPicker
          color={value.rgb}
          onChange={props => {
            setHex(props.hex);
          }}
          onChangeComplete={props => {
            onSubmit({ hex: props.hex, hsl: props.hsl, rgb: props.rgb });
            setAnchorEl(null);
          }}
        />
      </Popper>
    </>
  );
};
export default Color;
