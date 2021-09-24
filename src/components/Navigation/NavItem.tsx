import { Link, useLocation } from "react-router-dom";
import { MenuItem, MenuItemProps } from "@mui/material";

export default function NavItem(props: MenuItemProps<Link>) {
  const { pathname } = useLocation();

  return (
    <MenuItem
      component={Link}
      selected={pathname === props.to}
      {...props}
      sx={{
        ...props.sx,
        "&&::before": {
          left: "auto",
          right: 0,
        },
      }}
    />
  );
}
