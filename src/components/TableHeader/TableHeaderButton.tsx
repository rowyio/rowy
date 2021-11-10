import { forwardRef } from "react";
import { Tooltip, Button, ButtonProps } from "@mui/material";

export interface ITableHeaderButtonProps extends Partial<ButtonProps> {
  title: string;
  icon: React.ReactNode;
}

export const TableHeaderButton = forwardRef(function TableHeaderButton_(
  { title, icon, ...props }: ITableHeaderButtonProps,
  ref: React.Ref<HTMLButtonElement>
) {
  return (
    <Tooltip title={title}>
      <Button
        variant="outlined"
        color="secondary"
        size="small"
        style={{ minWidth: 40, height: 32, padding: 0 }}
        aria-label={title}
        {...props}
        ref={ref}
      >
        {icon}
      </Button>
    </Tooltip>
  );
});

export default TableHeaderButton;
