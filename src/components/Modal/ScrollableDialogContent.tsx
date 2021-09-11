import { memo } from "react";
import useScrollInfo from "react-element-scroll-hook";

import {
  Divider,
  DividerProps,
  DialogContent,
  DialogContentProps,
} from "@mui/material";

const MemoizedDialogContent = memo(function MemoizedDialogContent({
  setRef,
  ...props
}: DialogContentProps & { setRef: any }) {
  return <DialogContent {...props} ref={setRef} />;
});

export interface IScrollableDialogContentProps extends DialogContentProps {
  disableTopDivider?: boolean;
  disableBottomDivider?: boolean;
  dividerSx?: DividerProps["sx"];
  topDividerSx?: DividerProps["sx"];
  bottomDividerSx?: DividerProps["sx"];
}

export default function ScrollableDialogContent({
  disableTopDivider = false,
  disableBottomDivider = false,
  dividerSx,
  topDividerSx,
  bottomDividerSx,
  ...props
}: IScrollableDialogContentProps) {
  const [scrollInfo, setRef] = useScrollInfo();

  return (
    <>
      {!disableTopDivider &&
        scrollInfo.y.percentage !== null &&
        scrollInfo.y.percentage > 0 && (
          <Divider sx={{ ...dividerSx, ...topDividerSx }} />
        )}

      <MemoizedDialogContent {...props} setRef={setRef} />

      {!disableBottomDivider &&
        scrollInfo.y.percentage !== null &&
        scrollInfo.y.percentage < 1 && (
          <Divider sx={{ ...dividerSx, ...bottomDividerSx }} />
        )}
    </>
  );
}
