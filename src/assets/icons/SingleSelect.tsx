import SvgIcon, { SvgIconProps } from "@mui/material/SvgIcon";

export function SingleSelect(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M5 14a2 2 0 100-4 2 2 0 000 4zm4-9v2h12V5H9m0 6v2h12v-2H9m0 6v2h12v-2H9" />
    </SvgIcon>
  );
}
