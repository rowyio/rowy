import SvgIcon, { SvgIconProps } from "@material-ui/core/SvgIcon";

export default function MultiSelect(props: SvgIconProps) {
  return (
    <SvgIcon viewBox="-3 -3 24 20" {...props}>
      <path d="M0 8h2V6H0v2zm0 6h2v-2H0v2zM0 2h2V0H0v2zm4 6h14V6H4v2zm0 6h14v-2H4v2zM4 0v2h14V0H4z" />
    </SvgIcon>
  );
}
