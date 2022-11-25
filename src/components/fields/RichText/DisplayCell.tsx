import { IDisplayCellProps } from "@src/components/fields/types";
// import { useAtom } from "jotai";

import {
  // styled,
  useTheme,
  // Tooltip,
  // TooltipProps,
  // tooltipClasses,
  // Fade,
} from "@mui/material";
import RenderedHtml from "@src/components/RenderedHtml";

// import { tableScope, tableSchemaAtom } from "@src/atoms/tableScope";
// import { DEFAULT_ROW_HEIGHT } from "@src/components/Table";

// type StylesProps = { width: number; rowHeight: number };

// const StyledTooltip = styled(
//   ({ className, width, rowHeight, ...props }: TooltipProps & StylesProps) => (
//     <Tooltip {...props} classes={{ popper: className }} />
//   )
// )(({ theme, width, rowHeight }) => ({
//   [`& .${tooltipClasses.tooltip}`]: {
//     margin: 0,
//     marginTop: `-${rowHeight - 1}px !important`,
//     padding: theme.spacing(3 / 8, 1.25),

//     width: width - 1,
//     maxWidth: "none",
//     minHeight: rowHeight - 1,
//     overflowX: "hidden",

//     background: theme.palette.background.paper,
//     borderRadius: 0,
//     boxShadow: `0 0 0 1px ${theme.palette.divider}, ${theme.shadows[4]}`,
//     color: theme.palette.text.primary,

//     display: "flex",
//     alignItems: "center",
//   },
// }));

export default function RichText({ value, tabIndex }: IDisplayCellProps) {
  // const [tableSchema] = useAtom(tableSchemaAtom, tableScope);

  const theme = useTheme();

  if (!value) return null;

  const content = (
    <RenderedHtml
      html={value}
      style={{
        maxHeight: "100%",
        whiteSpace: "normal",

        ...theme.typography.body2,
        fontSize: "0.75rem",
        lineHeight: theme.typography.body2.lineHeight,
      }}
      // Prevent user tabbing into any rendered links
      {...({ inert: tabIndex === -1 ? "inert" : undefined } as any)}
    />
  );

  // temp disable tooltip, which causes performance issues
  return content;

  // return (
  //   <StyledTooltip
  //     title={content}
  //     enterDelay={1000}
  //     placement="bottom-start"
  //     PopperProps={{
  //       modifiers: [
  //         { name: "flip", enabled: false },
  //         { name: "preventOverflow", enabled: false },
  //         { name: "hide", enabled: false },
  //       ],
  //     }}
  //     TransitionComponent={Fade}
  //     width={column.width as number}
  //     rowHeight={tableSchema.rowHeight ?? DEFAULT_ROW_HEIGHT}
  //   >
  //     <div
  //       className="cell-collapse-padding"
  //       style={{
  //         width: "100%",
  //         padding: theme.spacing(3 / 8, 1.25),
  //         position: "absolute",
  //         top: 0,
  //         bottom: 0,

  //         display: "flex",
  //         alignItems: "center",
  //       }}
  //     >
  //       {content}
  //     </div>
  //   </StyledTooltip>
  // );
}
