import SvgIcon, { SvgIconProps } from "@material-ui/core/SvgIcon";

export default function SubTable(props: SvgIconProps) {
  return (
    <SvgIcon viewBox="0 0 24 12" {...props}>
      <path
        d="M16 12H0V0h16v12zM7 7H2v3h5V7zm7 0H9v3h5V7zM7 2H2v3h5V2zm7 0H9v3h5V2zM24 6.5L19 9V4z"
        fillRule="nonzero"
      />
    </SvgIcon>
  );
}
