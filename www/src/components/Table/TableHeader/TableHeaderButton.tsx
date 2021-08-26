import { Tooltip, IconButton, IconButtonProps } from "@material-ui/core";

export interface ITableHeaderButtonProps extends Partial<IconButtonProps> {
  title: string;
  icon: React.ReactNode;
}

export default function TableHeaderButton({
  title,
  icon,
  ...props
}: ITableHeaderButtonProps) {
  return (
    <Tooltip title={title}>
      <IconButton
        // variant="outlined"
        color="secondary"
        size="small"
        style={{ width: 32, height: 32 }}
        aria-label={title}
        {...props}
      >
        {icon}
      </IconButton>
    </Tooltip>
  );
}
