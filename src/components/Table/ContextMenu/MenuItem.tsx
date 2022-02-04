import {
  ListItemIcon,
  ListItemText,
  MenuItem,
  Typography,
} from "@mui/material";

export interface IContextMenuItem {
  onClick: () => void;
  icon: JSX.Element;
  label: string;
  disabled?: boolean;
  hotkeyLabel?: string;
}

export default function ContextMenuItem({
  onClick,
  icon,
  label,
  disabled,
  hotkeyLabel,
}: IContextMenuItem) {
  return (
    <MenuItem disabled={disabled} onClick={onClick}>
      <ListItemIcon>{icon} </ListItemIcon>
      <ListItemText> {label} </ListItemText>
      {hotkeyLabel && (
        <Typography variant="body2" color="text.secondary">
          {hotkeyLabel}
        </Typography>
      )}
    </MenuItem>
  );
}
