import React from "react";
import { PopoverProps } from "@mui/material";
import CopyCells from "@src/assets/icons/CopyCells";
import { useProjectContext } from "@src/contexts/ProjectContext";
import { MenuContents } from "./MenuContent";

export type CellMenuRef = {
  anchorEl: null;
  selectedCell: any | null;
  setSelectedCell: React.Dispatch<React.SetStateAction<any | null>>;
  setAnchorEl: React.Dispatch<
    React.SetStateAction<PopoverProps["anchorEl"] | null>
  >;
};

export default function CellMenu() {
  const { cellMenuRef }: any = useProjectContext();
  const [anchorEl, setAnchorEl] = React.useState<any>(null);
  const [selectedCell, setSelectedCell] = React.useState<any>(null);
  const open = Boolean(anchorEl);

  if (cellMenuRef)
    cellMenuRef.current = {
      anchorEl,
      setAnchorEl,
      selectedCell,
      setSelectedCell,
    } as {};

  const handleClose = () => setAnchorEl(null);
  const handleCopy = () => {
    const selected = anchorEl.innerHTML;
    const copy = navigator.clipboard.writeText(selected);
    const onSuccess = () => {
      console.log("Copied");
      var promise = navigator.clipboard.readText();
      promise.then((text) => console.log(text));
    };
    const onFail = () => console.log("Fail to copy");

    copy.then(onSuccess, onFail);
    handleClose();
  };

  const cellMenuAction = [
    { label: "Copy", icon: <CopyCells />, color: "", onClick: handleCopy },
  ];

  if (!cellMenuRef.current || !open) return <></>;
  return (
    <MenuContents
      anchorEl={anchorEl}
      open={open}
      handleClose={handleClose}
      items={cellMenuAction}
    />
  );
}
