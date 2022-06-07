import {
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  MenuItem,
  MenuItemProps,
  Typography,
  Menu,
} from "@mui/material";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { useState } from "react";

export interface IContextMenuItem extends Partial<MenuItemProps> {
  onClick?: () => void;
  icon?: React.ReactNode;
  label: string;
  disabled?: boolean;
  hotkeyLabel?: string;
}

export interface IContextMenuItemProps extends IContextMenuItem {
  subItems?: IContextMenuItem[];
}
export default function ContextMenuItem({
  onClick,
  icon,
  label,
  hotkeyLabel,
  subItems,
  ...props
}: IContextMenuItemProps) {
  const [subMenu, setSubMenu] = useState<EventTarget | null>(null);

  if (subItems && subItems.length > 0) {
    return (
      <>
        <MenuItem onClick={(e) => setSubMenu(e.target)}>
          {label}
          <ListItemSecondaryAction style={{ pointerEvents: "none" }}>
            <ArrowRightIcon style={{ display: "block" }} />
          </ListItemSecondaryAction>
        </MenuItem>
        {subMenu && (
          <Menu
            anchorEl={subMenu as any}
            id={`${label}-sub-menu`}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
            open
            onClose={() => setSubMenu(null)}
            sx={{ "& .MuiPaper-root": { mt: -0.5 } }}
          >
            {subItems?.map((itemProps) => (
              <MenuItem {...itemProps}>
                <ListItemIcon>{itemProps.icon}</ListItemIcon>
                <ListItemText>{itemProps.label}</ListItemText>
                {itemProps.hotkeyLabel && (
                  <Typography variant="body2" color="text.secondary">
                    {itemProps.hotkeyLabel}
                  </Typography>
                )}
              </MenuItem>
            ))}
          </Menu>
        )}
      </>
    );
  } else
    return (
      <MenuItem {...props} onClick={onClick}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText>{label}</ListItemText>
        {hotkeyLabel && (
          <Typography variant="body2" color="text.secondary">
            {hotkeyLabel}
          </Typography>
        )}
      </MenuItem>
    );
}
