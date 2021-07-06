import SvgIcon, { SvgIconProps } from "@material-ui/core/SvgIcon";

export default function FileDownload(props: SvgIconProps) {
  return (
    <SvgIcon viewBox="-2 -2 24 24" {...props}>
      <path
        d="M2 20a2 2 0 01-2-2V2a2 2 0 012-2h16a2 2 0 012 2v16a2 2 0 01-2 2H2zm16-6h-7v4h7v-4zm-9 0H2v4h7v-4zm9-6h-7v4h7V8zM9 8H2v4h7V8zm9-6h-7v4h7V2zM9 2H2v4h7V2z"
        fillRule="nonzero"
      />
    </SvgIcon>
  );
}
