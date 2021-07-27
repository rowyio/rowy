import SvgIcon, { SvgIconProps } from "@material-ui/core/SvgIcon";

export default function FileDownload(props: SvgIconProps) {
  return (
    <SvgIcon viewBox="-2 -2 24 24" {...props}>
      <path
        fillRule="nonzero"
        d="M9 0a2 2 0 012 2v16a2 2 0 01-2 2H0V0h9M2 8v4h7V8H2m0 6v4h7v-4H2M2 2v4h7V2H2m11 7h3V6h2v3h3v2h-3v3h-2v-3h-3V9z"
      />
    </SvgIcon>
  );
}
