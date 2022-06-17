import SvgIcon, { SvgIconProps } from "@mui/material/SvgIcon";

export function Slider(props: SvgIconProps) {
  return (
    <SvgIcon viewBox="0 2 24 20" {...props}>
      <path d="M10 9c1.306 0 2.418.835 2.83 2H21v2h-8.171a3.001 3.001 0 01-5.658 0H3v-2h4.17A3.001 3.001 0 0110 9z" />
    </SvgIcon>
  );
}
