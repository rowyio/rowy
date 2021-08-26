import SvgIcon, { SvgIconProps } from "@material-ui/core/SvgIcon";

export default function FileDownload(props: SvgIconProps) {
  return (
    <SvgIcon viewBox="-2 -2 24 24" {...props}>
      <path
        fillRule="nonzero"
        d="M2 0h7a2 2 0 012 2v16a2 2 0 01-2 2H2a2 2 0 01-2-2V2a2 2 0 012-2m0 8v4h7V8H2m0 6v4h7v-4H2M2 2v4h7V2H2m13.59 8L13 7.41 14.41 6 17 8.59 19.59 6 21 7.41 18.41 10 21 12.59 19.59 14 17 11.41 14.41 14 13 12.59 15.59 10z"
      />
    </SvgIcon>
  );
}
