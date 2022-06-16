import { forwardRef } from "react";
import { Tooltip, Button, ButtonProps } from "@mui/material";

export interface ITableToolbarButtonProps extends Partial<ButtonProps> {
  title: string;
  icon: React.ReactNode;
}

export const TableToolbarButton = forwardRef(function TableToolbarButton_(
  { title, icon, ...props }: ITableToolbarButtonProps,
  ref: React.Ref<HTMLButtonElement>
) {
  return (
    <Tooltip title={title}>
      <span>
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
      </span>
    </Tooltip>
  );
});

export default TableToolbarButton;
