import SvgIcon, { SvgIconProps } from "@material-ui/core/SvgIcon";

export default function ConnectTable(props: SvgIconProps) {
  return (
    <SvgIcon viewBox="0 0 24 7" {...props}>
      <path
        d="M0 7V0h16v7H0zm7-5H2v3h5V2zm7 0H9v3h5V2zM24 3.5L19 6V1z"
        fillRule="nonzero"
      />
    </SvgIcon>
  );
}
