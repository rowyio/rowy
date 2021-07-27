import SvgIcon, { SvgIconProps } from "@material-ui/core/SvgIcon";

export default function Slider(props: SvgIconProps) {
  return (
    <SvgIcon viewBox="0 2 24 20" {...props}>
      <path d="M8.999 9c1.306 0 2.417.835 2.83 2H21v2h-9.172a3.001 3.001 0 01-5.658 0H2.999v-2h3.17A3.001 3.001 0 019 9zm0 2a1 1 0 100 2 1 1 0 000-2z" />
    </SvgIcon>
  );
}
