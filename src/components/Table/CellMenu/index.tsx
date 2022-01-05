import { ConstructionOutlined } from "@mui/icons-material";
import { ListItem, Menu, MenuItem } from "@mui/material";
import { useProjectContext } from "@src/contexts/ProjectContext";
import React, { useEffect, useState } from "react";

//This does not belong here
export type CellMenuRef = {
  anchorEl: any | null;
  selectedCell: any | null;
  setSelectedCell: any | null;
  setAnchorEl: React.Dispatch<React.SetStateAction<any | null>>;
  anchorEle;
};

export default function CellMenu() {
  const { cellMenuRef, tableState }: any = useProjectContext();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedCell, setSelectedCell] = React.useState<any>(null);

  const open = Boolean(anchorEl);

  if (cellMenuRef)
    cellMenuRef.current = {
      anchorEl,
      setAnchorEl,
      selectedCell,
      setSelectedCell,
    } as {};

  const handleClose = () => {
    setAnchorEl(null);
  };

  if (!cellMenuRef.current) return <></>;
  return (
    <MenuContents anchorEl={anchorEl} open={open} handleClose={handleClose} />
  );
}

const MenuContents = ({ anchorEl, open, handleClose }: any) => {
  const handleCopy = () => {
    const input = anchorEl as HTMLElement;
    const copy = navigator.clipboard.writeText(input.innerHTML);
    copy.then(
      () => {
        console.log("copy");
        var promise = navigator.clipboard.readText();
        promise.then((text) => console.log(text));
      },
      () => console.log("failed to copy")
    );
    handleClose();
  };

  const handleContext = (e: React.MouseEvent) => {
    e.preventDefault();
  };
  if (!open) return <></>;
  return (
    <Menu
      id="demo-positioned-menu"
      aria-labelledby="demo-positioned-button"
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
      <MenuItem onClick={handleCopy}>Copy Cell</MenuItem>
      <MenuItem onClick={handleCopy}>Copy Cell Id</MenuItem>
    </Menu>
  );
};
