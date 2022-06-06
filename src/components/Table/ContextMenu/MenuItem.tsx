import {
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuItemProps,
  Typography,
} from "@mui/material";

export interface IContextMenuItem extends Partial<MenuItemProps> {
  onClick: () => void;
  icon?: React.ReactNode;
  label: string;
  disabled?: boolean;
  hotkeyLabel?: string;
}

export default function ContextMenuItem({
  onClick,
  icon,
  label,
  hotkeyLabel,
  ...props
}: IContextMenuItem) {
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
