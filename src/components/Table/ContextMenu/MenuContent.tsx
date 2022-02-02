import { Menu } from "@mui/material";
import MenuRow, { IMenuRow } from "./MenuRow";

interface IMenuContents {
  anchorEl: HTMLElement;
  open: boolean;
  handleClose: () => void;
  items: IMenuRow[];
}

export function MenuContents({
  anchorEl,
  open,
  handleClose,
  items,
}: IMenuContents) {
  const handleContext = (e: React.MouseEvent) => e.preventDefault();

  return (
    <Menu
      id="cell-context-menu"
      aria-labelledby="cell-context-menu"
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      sx={{ "& .MuiMenu-paper": { backgroundColor: "background.default" } }}
      MenuListProps={{ disablePadding: true }}
      onContextMenu={handleContext}
    >
      {items.map((item, indx: number) => (
        <MenuRow key={indx} {...item} />
      ))}
    </Menu>
  );
}
