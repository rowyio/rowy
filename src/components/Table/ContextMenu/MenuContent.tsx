import { Menu } from "@mui/material";
import { default as MenuItem } from "./MenuItem";
import { IContextMenuItem } from "./MenuItem";

interface IMenuContents {
  anchorEl: HTMLElement;
  open: boolean;
  handleClose: () => void;
  items: IContextMenuItem[];
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
      sx={{
        "& .MuiMenu-paper": {
          backgroundColor: "background.default",
          width: 200,
          maxWidth: "100%",
        },
      }}
      onContextMenu={handleContext}
    >
      {items.map((item, indx: number) => (
        <MenuItem key={indx} {...item} />
      ))}
    </Menu>
  );
}
