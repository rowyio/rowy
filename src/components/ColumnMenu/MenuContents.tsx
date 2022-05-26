import { Fragment } from "react";

import { MenuItem, ListItemIcon, ListSubheader, Divider } from "@mui/material";

export interface IMenuContentsProps {
  menuItems: {
    type?: string;
    label?: string;
    activeLabel?: string;
    icon?: JSX.Element;
    activeIcon?: JSX.Element;
    onClick?: () => void;
    active?: boolean;
    color?: "error";
    disabled?: boolean;
  }[];
}

export default function MenuContents({ menuItems }: IMenuContentsProps) {
  return (
    <>
      {menuItems.map((item, index) => {
        if (item.type === "subheader")
          return (
            <Fragment key={index}>
              <Divider variant="middle" sx={{ my: 0.5 }} />
              {item.label && (
                <ListSubheader disableSticky>{item.label}</ListSubheader>
              )}
            </Fragment>
          );

        let icon: JSX.Element = item.icon ?? <></>;
        if (item.active && !!item.activeIcon) icon = item.activeIcon;

        return (
          <MenuItem
            key={index}
            onClick={item.onClick}
            color={item.color}
            selected={item.active}
            disabled={item.disabled}
          >
            <ListItemIcon>{icon}</ListItemIcon>
            {item.active ? item.activeLabel : item.label}
          </MenuItem>
        );
      })}
    </>
  );
}
