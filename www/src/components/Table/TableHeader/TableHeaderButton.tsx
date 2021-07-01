import { Tooltip, Button, ButtonProps } from "@material-ui/core";

export interface ITableHeaderButtonProps extends Partial<ButtonProps> {
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
      <Button
        variant="contained"
        color="secondary"
        style={{ minWidth: 32, padding: 0 }}
        aria-label={title}
        {...props}
      >
        {icon}
      </Button>
    </Tooltip>
  );
}
