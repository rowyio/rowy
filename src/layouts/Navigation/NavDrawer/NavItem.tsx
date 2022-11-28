import { Link, useLocation } from "react-router-dom";
import { HashLink } from "react-router-hash-link";

import { MenuItem, MenuItemProps } from "@mui/material";
import { spreadSx } from "@src/utils/ui";

const linkProps = { target: "_blank", rel: "noopener noreferrer" };

type NavItemComponent = typeof HashLink | typeof Link | "a" | "button";

export default function NavItem(props: MenuItemProps<NavItemComponent>) {
  const { pathname } = useLocation();

  let component: NavItemComponent = "button";
  if ("to" in props && props.to !== undefined) {
    component = Link;
    if (
      typeof props.to === "string" ? props.to.includes("#") : !!props.to.hash
    ) {
      component = HashLink;
    }
  } else if ("href" in props && props.href !== undefined) {
    component = "a";
  }

  return (
    <MenuItem
      role="none"
      tabIndex={0}
      component={component}
      selected={"to" in props ? pathname === props.to : false}
      {...props}
      {...("href" in props ? linkProps : {})}
      sx={[
        {
          overflow: "hidden",
          textAlign: "left",
          color: "text.secondary",

          "& .MuiListItemText-primary": {
            typography: "button",
            overflow: "hidden",
          },
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
