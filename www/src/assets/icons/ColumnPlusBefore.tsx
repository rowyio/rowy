import SvgIcon, { SvgIconProps } from "@material-ui/core/SvgIcon";

export default function FileDownload(props: SvgIconProps) {
  return (
    <SvgIcon viewBox="-2 -2 24 24" {...props}>
      <path
        fillRule="nonzero"
        d="M12 0a2 2 0 00-2 2v16a2 2 0 002 2h9V0h-9m7 8v4h-7V8h7m0 6v4h-7v-4h7m0-12v4h-7V2h7M8 9H5V6H3v3H0v2h3v3h2v-3h3V9z"
      />
    </SvgIcon>
  );
}
