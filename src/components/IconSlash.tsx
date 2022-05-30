import { styled } from "@mui/material";

export const ICON_SLASH_STROKE_DASHOFFSET = 27.9;

const StyledSvg = styled("svg")(({ theme }) => ({
  stroke: "currentColor",
  strokeWidth: 2,
  position: "absolute",
  inset: 0,

  transition: theme.transitions.create("stroke-dashoffset", {
    duration: theme.transitions.duration.short,
  }),
  strokeDasharray: ICON_SLASH_STROKE_DASHOFFSET,
  strokeDashoffset: ICON_SLASH_STROKE_DASHOFFSET,

  "& .icon-slash-mask": { stroke: theme.palette.background.default },
}));

export default function IconSlash(props: React.SVGProps<SVGSVGElement>) {
  return (
    <StyledSvg viewBox="0 0 24 24" className="icon-slash" {...props}>
      <line
        className="icon-slash-mask"
        x1="3.08"
        y1="1.04"
        x2="22.8633788"
        y2="20.7130253"
      />
      <line
        className="icon-slash-mask"
        x1="1.75"
        y1="2.365"
        x2="21.475"
        y2="22.095"
      />

      <line x1="1.75" y1="2.365" x2="21.475" y2="22.095" />
    </StyledSvg>
  );
}
