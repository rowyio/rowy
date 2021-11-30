import { memo, ReactNode, ElementType } from "react";
import useScrollInfo from "react-element-scroll-hook";

import { styled, Divider, DividerProps } from "@mui/material";

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
  children?: ReactNode | ElementType[];
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
          <Divider
            sx={[
              ...(Array.isArray(dividerSx) ? dividerSx : [dividerSx]),
              ...(Array.isArray(topDividerSx) ? topDividerSx : [topDividerSx]),
            ]}
          />
        )}

      <MemoizedList ref={setRef} sx={listSx}>
        {children}
      </MemoizedList>

      {!disableBottomDivider &&
        scrollInfo.y.percentage !== null &&
        scrollInfo.y.percentage < 1 && (
          <Divider
            sx={[
              ...(Array.isArray(dividerSx) ? dividerSx : [dividerSx]),
              ...(Array.isArray(bottomDividerSx)
                ? bottomDividerSx
                : [bottomDividerSx]),
            ]}
          />
        )}
    </>
  );
}
