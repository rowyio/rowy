import { Link, useLocation } from "react-router-dom";
import { MenuItem, MenuItemProps } from "@mui/material";

export default function NavItem(props: MenuItemProps<typeof Link>) {
  const { pathname } = useLocation();

  return (
    <MenuItem
      component={Link}
      selected={pathname === props.to}
      {...props}
      sx={{
        "& .MuiListItemText-primary": {
          typography: "button",
          color: "text.secondary",
        },
        "& .MuiListItemIcon-root": { opacity: 0.87 },

        "&:hover, &.Mui-selected": {
          "& .MuiListItemText-primary": { color: "text.primary" },
          "& .MuiSvgIcon-root": { color: "text.primary" },
        },

        ...props.sx,
        "&&::before": { left: "auto", right: 0 },
      }}
    />
  );
}
