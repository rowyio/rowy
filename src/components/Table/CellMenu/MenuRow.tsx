import { ListItemIcon, ListItemText, MenuItem } from "@mui/material";

export interface IMenuRow {
  onClick: () => void;
  icon: JSX.Element;
  label: string;
}

export default function MenuRow({ onClick, icon, label }: IMenuRow) {
  return (
    <MenuItem onClick={onClick}>
      <ListItemIcon>{icon} </ListItemIcon>
      <ListItemText> {label} </ListItemText>
    </MenuItem>
  );
}
