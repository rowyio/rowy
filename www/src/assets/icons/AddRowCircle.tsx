import SvgIcon, { SvgIconProps } from "@material-ui/core/SvgIcon";

export default function AddRowCircle(props: SvgIconProps) {
  return (
    <SvgIcon viewBox="0 0 32 32" {...props}>
      <path d="M16 0c8.837 0 16 7.163 16 16s-7.163 16-16 16S0 24.837 0 16 7.163 0 16 0zm1 20h-2v3h-3v2h3v3h2v-3h3v-2h-3v-3zm12-9H3v7h26v-7zm-18 2v3H5v-3h6zm8 0v3h-6v-3h6zm8 0v3h-6v-3h6z" />
    </SvgIcon>
  );
}
