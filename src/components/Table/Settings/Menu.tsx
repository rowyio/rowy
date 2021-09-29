import React from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const options = ["Webhooks", "Rules", "Algolia", "CollectionSync"];

const ITEM_HEIGHT = 48;

export default function SettingsMenu({ modal, setModal }) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (option: string) => () => {
    setModal(option);
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        aria-label="More"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose("")}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: "20ch",
          },
        }}
      >
        {options.map((option) => (
          <MenuItem
            key={option}
            value={option}
            selected={option === modal}
            onClick={handleClose(option)}
            disabled={["Rules", "Algolia", "CollectionSync"].includes(option)}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
