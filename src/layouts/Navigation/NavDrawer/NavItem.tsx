import { Link, useLocation } from "react-router-dom";
import { MenuItem, MenuItemProps } from "@mui/material";
import { spreadSx } from "@src/utils/ui";

const linkProps = { target: "_blank", rel: "noopener noreferrer" };

export default function NavItem(
  props: MenuItemProps<typeof Link | "a" | "button">
) {
  const { pathname } = useLocation();

  return (
    <MenuItem
      component={"to" in props ? Link : "href" in props ? "a" : "button"}
      selected={"to" in props ? pathname === props.to : false}
      {...props}
      {...("href" in props ? linkProps : {})}
      sx={[
        {
          overflow: "hidden",
          textAlign: "left",
          color: "text.secondary",

          "& .MuiListItemText-primary": { typography: "button" },
          "& .MuiSvgIcon-root": {
            color: "inherit",
            opacity: 0.87,
            display: "block",
          },

          "&:hover, &.Mui-selected": {
            "& .MuiListItemText-primary": { color: "text.primary" },
            "& .MuiSvgIcon-root": { color: "text.primary" },
          },
        },
        ...spreadSx(props.sx),
      ]}
    />
  );
}
