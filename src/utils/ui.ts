import { SxProps, Theme } from "@mui/material";

export const isTargetInsideBox = (target: Element, box: Element) => {
  const targetRect = target.getBoundingClientRect();
  const boxRect = box.getBoundingClientRect();
  return targetRect.y < boxRect.y + boxRect.height;
};

export const spreadSx = (sx?: SxProps<Theme>) =>
  Array.isArray(sx) ? sx : sx ? [sx] : [];
