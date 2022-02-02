import { ListItemIcon, ListItemText, MenuItem } from "@mui/material";

export interface IMenuRow {
  onClick: () => void;
  icon: JSX.Element;
  label: string;
  disabled?: boolean;
}

export default function MenuRow({ onClick, icon, label, disabled }: IMenuRow) {
  return (
    <MenuItem disabled={disabled} onClick={onClick}>
      <ListItemIcon>{icon} </ListItemIcon>
      <ListItemText> {label} </ListItemText>
    </MenuItem>
  );
}
