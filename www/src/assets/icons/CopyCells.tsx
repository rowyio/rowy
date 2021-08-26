import SvgIcon, { SvgIconProps } from "@material-ui/core/SvgIcon";

export default function CopyCells(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M21 9v11H7V9h14zm-2 2H9v7h10v-7zm-1-6v2H5v6H3V5h15z" />
    </SvgIcon>
  );
}
