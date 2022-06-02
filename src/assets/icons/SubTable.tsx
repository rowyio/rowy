import SvgIcon, { SvgIconProps } from "@mui/material/SvgIcon";

export function SubTable(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M20 9v7l4-3.5L20 9zM4 5h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V7a2 2 0 012-2zm0 7h5V9H4v3m0 5h5v-3H4v3m7-5h5V9h-5v3m0 5h5v-3h-5v3" />
    </SvgIcon>
  );
}
