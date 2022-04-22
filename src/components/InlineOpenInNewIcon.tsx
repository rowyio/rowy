import { styled } from "@mui/material";

export const InlineOpenInNewIcon = styled("span")(() => ({
  position: "relative",
  width: "1em",
  height: "1em",
  marginLeft: "0.25ch",
  display: "inline-block",
  verticalAlign: "baseline",

  "&::after": {
    content: "'\\2197'",
    position: "absolute",
    top: 0,
    left: 0,
  },
}));

export default InlineOpenInNewIcon;
