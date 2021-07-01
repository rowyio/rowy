import SvgIcon, { SvgIconProps } from "@material-ui/core/SvgIcon";

export default function AddColumnCircle(props: SvgIconProps) {
  return (
    <SvgIcon viewBox="0 0 32 32" {...props}>
      <path d="M16 0c8.837 0 16 7.163 16 16s-7.163 16-16 16S0 24.837 0 16 7.163 0 16 0zm1 8H7v17h10V8zm-2 12v3H9v-3h6zm9-8h-2v3h-3v2h3v3h2v-3h3v-2h-3v-3zm-9 3v3H9v-3h6zm0-5v3H9v-3h6z" />
    </SvgIcon>
  );
}
