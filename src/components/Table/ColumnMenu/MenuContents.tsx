import { Fragment } from "react";

import {
  MenuItem,
  ListItemIcon,
  ListSubheader,
  Divider,
} from "@mui/material";
import { alpha } from "@mui/material/styles";

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
            sx={
              item.color === "error"
                ? {
                    color: "error.main",
                    "&:hover": {
                      backgroundColor: (theme) =>
                        alpha(
                          theme.palette.error.main,
                          theme.palette.action.hoverOpacity
                        ),
                    },
                  }
                : undefined
            }
            selected={item.active}
            disabled={item.disabled}
          >
            <ListItemIcon
              sx={
                item.color === "error"
                  ? {
                      color: (theme) =>
                        alpha(
                          theme.palette.error.main,
                          theme.palette.action.activeOpacity * 1.1
                        ),
                    }
                  : undefined
              }
            >
              {icon}
            </ListItemIcon>
            {item.active ? item.activeLabel : item.label}
          </MenuItem>
        );
      })}
    </>
  );
}
