import { Divider, Menu } from "@mui/material";
import { default as MenuItem } from "./MenuItem";
import { IContextMenuItem } from "./MenuItem";

interface IMenuContents {
  anchorEl: HTMLElement;
  open: boolean;
  handleClose: () => void;
  groups: IContextMenuItem[][];
}

export default function MenuContents({
  anchorEl,
  open,
  handleClose,
  groups,
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
        },
      }}
      onContextMenu={handleContext}
    >
      {groups.map((items, groupIndex) => (
        <>
          {groupIndex > 0 && <Divider variant="middle" />}
          {items.map((item, index: number) => (
            <MenuItem key={`contextMenu-${groupIndex}-${index}`} {...item} />
          ))}
        </>
      ))}
    </Menu>
  );
}
