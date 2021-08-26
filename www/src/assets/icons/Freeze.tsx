import SvgIcon, { SvgIconProps } from "@material-ui/core/SvgIcon";

export default function FileDownload(props: SvgIconProps) {
  return (
    <SvgIcon viewBox="-2 -2 24 24" {...props}>
      <path
        d="M18 0a2 2 0 012 2v16a2 2 0 01-2 2H2a2 2 0 01-2-2V2A2 2 0 011.135.196l.047-.074.051.03C1.469.054 1.728 0 2 0h16zm0 14h-7v4h7v-4zm-16 .992V18h4.813L2 14.992zM9 14H4.187L9 17.008V14zm9-6h-7v4h7V8zM2 8.992V12h4.813L2 8.992zM9 8H4.187L9 11.007V8zm9-6h-7v4h7V2zM2 2.992V6h4.814L2 2.992zM9 2H4.188L9 5.007V2z"
        fillRule="nonzero"
      />
    </SvgIcon>
  );
}
