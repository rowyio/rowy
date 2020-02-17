import React, { useEffect, useState } from "react";
import { ChromePicker } from "react-color";

import {
  makeStyles,
  createStyles,
  Popper,
  Grow,
  ClickAwayListener,
} from "@material-ui/core";

const useStyles = makeStyles(theme =>
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
      marginLeft: 2,
      marginRight: theme.spacing(1),

      border: `1px solid ${theme.palette.text.disabled}`,
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
      <div className={classes.root} onDoubleClick={handleClick}>
        <div
          className={classes.colorIndicator}
          style={{ backgroundColor: hex }}
        />
        {hex}
      </div>

      <Popper id={id} open={open} anchorEl={anchorEl} transition>
        {({ TransitionProps }) => (
          <Grow {...TransitionProps} style={{ transformOrigin: "top left" }}>
            <div>
              <ClickAwayListener onClickAway={onClickAway}>
                <ChromePicker
                  color={value.rgb}
                  onChange={props => {
                    setHex(props.hex);
                  }}
                  onChangeComplete={props => {
                    onSubmit({
                      hex: props.hex,
                      hsl: props.hsl,
                      rgb: props.rgb,
                    });
                    setAnchorEl(null);
                  }}
                />
              </ClickAwayListener>
            </div>
          </Grow>
        )}
      </Popper>
    </>
  );
};
export default Color;
