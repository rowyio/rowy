import SvgIcon, { SvgIconProps } from "@material-ui/core/SvgIcon";

export default function Export(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M12 0L8 4h3v9h2V4h3m2 18H6a2 2 0 01-2-2V8a2 2 0 012-2h3v2H6v12h12V8h-3V6h3a2 2 0 012 2v12a2 2 0 01-2 2z" />
    </SvgIcon>
  );
}
