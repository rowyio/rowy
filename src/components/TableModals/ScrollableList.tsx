import { memo } from "react";
import useScrollInfo from "react-element-scroll-hook";

import { styled, Divider, DividerProps } from "@mui/material";
import { spreadSx } from "@src/utils/ui";

const MemoizedList = memo(
  styled("ul")(({ theme }) => ({
    listStyleType: "none",
    margin: 0,
    padding: theme.spacing(1.5, 0, 3),

    height: 400,
    overflowY: "auto",

    "& li": { margin: theme.spacing(0.5, 0) },
  }))
);

export interface IFadeListProps {
  children?: React.ReactNode;
  disableTopDivider?: boolean;
  disableBottomDivider?: boolean;
  dividerSx?: DividerProps["sx"];
  topDividerSx?: DividerProps["sx"];
  bottomDividerSx?: DividerProps["sx"];
  listSx?: DividerProps["sx"];
}

export default function FadeList({
  children,
  disableTopDivider = true,
  disableBottomDivider = false,
  dividerSx = [],
  topDividerSx = [],
  bottomDividerSx = [],
  listSx,
}: IFadeListProps) {
  const [scrollInfo, setRef] = useScrollInfo();

  return (
    <>
      {!disableTopDivider &&
        scrollInfo.y.percentage !== null &&
        scrollInfo.y.percentage > 0 && (
          <Divider sx={[...spreadSx(dividerSx), ...spreadSx(topDividerSx)]} />
        )}

      <MemoizedList ref={setRef} sx={listSx}>
        {children}
      </MemoizedList>

      {!disableBottomDivider &&
        scrollInfo.y.percentage !== null &&
        scrollInfo.y.percentage < 1 && (
          <Divider
            sx={[...spreadSx(dividerSx), ...spreadSx(bottomDividerSx)]}
          />
        )}
    </>
  );
}
