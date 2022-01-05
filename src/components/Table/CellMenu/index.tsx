import React from "react";
import { PopoverProps } from "@mui/material";
import CopyCells from "@src/assets/icons/CopyCells";
import { useProjectContext } from "@src/contexts/ProjectContext";
import { MenuContents } from "./MenuContent";

export type CellMenuRef = {
  anchorEl: HTMLElement | null;
  setAnchorEl: React.Dispatch<
    React.SetStateAction<PopoverProps["anchorEl"] | null>
  >;
};

export default function CellMenu() {
  const { cellMenuRef }: any = useProjectContext();
  const [anchorEl, setAnchorEl] = React.useState<any | null>(null);
  const open = Boolean(anchorEl);

  if (cellMenuRef)
    cellMenuRef.current = {
      anchorEl,
      setAnchorEl,
    } as {};

  const handleClose = () => setAnchorEl(null);
  const handleCopy = () => {
    const selected: any = anchorEl?.innerHTML;
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
