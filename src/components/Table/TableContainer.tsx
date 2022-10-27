import { colord } from "colord";
import { styled, alpha, darken, lighten } from "@mui/material";
import { TOP_BAR_HEIGHT } from "@src/layouts/Navigation/TopBar";
import { TABLE_TOOLBAR_HEIGHT } from "@src/components/TableToolbar";
import {
  DRAWER_COLLAPSED_WIDTH,
  DRAWER_WIDTH,
} from "@src/components/SideDrawer";

export const OUT_OF_ORDER_MARGIN = 8;

export const TableContainer = styled("div", {
  shouldForwardProp: (prop) => prop !== "rowHeight",
})<{ rowHeight: number }>(({ theme, rowHeight }) => ({
  display: "flex",
  position: "relative",
  flexDirection: "column",
  height: `calc(100vh - ${TOP_BAR_HEIGHT}px - ${TABLE_TOOLBAR_HEIGHT}px)`,

  "& .left-scroll-divider": {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: 1,
    zIndex: 1,

    backgroundColor: colord(theme.palette.background.paper)
      .mix(theme.palette.divider, 0.12)
      .alpha(1)
      .toHslString(),
  },

  "& > .rdg": {
    width: `calc(100% - ${DRAWER_COLLAPSED_WIDTH}px)`,
    flex: 1,
    paddingBottom: `max(env(safe-area-inset-bottom), ${theme.spacing(2)})`,
  },

  [theme.breakpoints.down("sm")]: { width: "100%" },

  "& .rdg": {
    "--color": theme.palette.text.primary,
    "--border-color": theme.palette.divider,
    // "--summary-border-color": "#aaa",
    "--background-color":
      theme.palette.mode === "light"
        ? theme.palette.background.paper
        : colord(theme.palette.background.paper)
            .mix("#fff", 0.04)
            .alpha(1)
            .toHslString(),
    "--header-background-color": theme.palette.background.default,
    "--row-hover-background-color": colord(theme.palette.background.paper)
      .mix(theme.palette.action.hover, theme.palette.action.hoverOpacity)
      .alpha(1)
      .toHslString(),
    "--row-selected-background-color":
      theme.palette.mode === "light"
        ? lighten(theme.palette.primary.main, 0.9)
        : darken(theme.palette.primary.main, 0.8),
    "--row-selected-hover-background-color":
      theme.palette.mode === "light"
        ? lighten(theme.palette.primary.main, 0.8)
        : darken(theme.palette.primary.main, 0.7),
    "--checkbox-color": theme.palette.primary.main,
    "--checkbox-focus-color": theme.palette.primary.main,
    "--checkbox-disabled-border-color": "#ccc",
    "--checkbox-disabled-background-color": "#ddd",
    "--selection-color": theme.palette.primary.main,
    "--font-size": "0.75rem",
    "--cell-padding": theme.spacing(0, 1.25),

    border: "none",
    backgroundColor: "transparent",

    ...(theme.typography.caption as any),
    // fontSize: "0.8125rem",
    lineHeight: "inherit !important",

    "& .rdg-cell": {
      display: "flex",
      alignItems: "center",
      padding: 0,

      overflow: "visible",
      contain: "none",
      position: "relative",

      lineHeight: "calc(var(--row-height) - 1px)",
    },

    "& .rdg-cell-frozen": {
      position: "sticky",
    },
    "& .rdg-cell-frozen-last": {
      boxShadow: theme.shadows[2]
        .replace(/, 0 (\d+px)/g, ", $1 0")
        .split("),")
        .slice(1)
        .join("),"),

      "&[aria-selected=true]": {
        boxShadow:
          theme.shadows[2]
            .replace(/, 0 (\d+px)/g, ", $1 0")
            .split("),")
            .slice(1)
            .join("),") + ", inset 0 0 0 2px var(--selection-color)",
      },
    },

    "& .rdg-cell-copied": {
      backgroundColor:
        theme.palette.mode === "light"
          ? lighten(theme.palette.primary.main, 0.7)
          : darken(theme.palette.primary.main, 0.6),
    },

    "& .final-column-cell": {
      backgroundColor: "var(--header-background-color)",
      borderColor: "var(--header-background-color)",
      color: theme.palette.text.disabled,
      padding: "var(--cell-padding)",
    },
  },

  ".rdg-row, .rdg-header-row": {
    marginLeft: `max(env(safe-area-inset-left), ${theme.spacing(2)})`,
    marginRight: `max(env(safe-area-inset-right), ${DRAWER_WIDTH}px)`,
    display: "inline-grid", // Fix Safari not showing margin-right
  },

  ".rdg-header-row .rdg-cell:first-of-type": {
    borderTopLeftRadius: theme.shape.borderRadius,
  },
  ".rdg-header-row .rdg-cell:last-of-type": {
    borderTopRightRadius: theme.shape.borderRadius,
  },

  ".rdg-header-row .rdg-cell.final-column-header": {
    border: "none",
    padding: theme.spacing(0, 0.75),
    borderBottomRightRadius: theme.shape.borderRadius,

    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",

    position: "relative",
    "&::before": {
      content: "''",
      display: "block",
      width: 88,
      height: "100%",

      position: "absolute",
      top: 0,
      left: 0,

      border: "1px solid var(--border-color)",
      borderLeftWidth: 0,
      borderTopRightRadius: theme.shape.borderRadius,
      borderBottomRightRadius: theme.shape.borderRadius,
    },
  },

  ".rdg-row .rdg-cell:first-of-type, .rdg-header-row .rdg-cell:first-of-type": {
    borderLeft: "1px solid var(--border-color)",
  },

  ".rdg-row:last-of-type": {
    borderBottomLeftRadius: theme.shape.borderRadius,
    borderBottomRightRadius: theme.shape.borderRadius,

    "& .rdg-cell:first-of-type": {
      borderBottomLeftRadius: theme.shape.borderRadius,
    },
    "& .rdg-cell:nth-last-of-type(2)": {
      borderBottomRightRadius: theme.shape.borderRadius,
    },
  },

  ".rdg-header-row .rdg-cell": {
    borderTop: "1px solid var(--border-color)",
  },

  ".rdg-row:hover": { color: theme.palette.text.primary },

  ".row-hover-iconButton": {
    color: theme.palette.text.disabled,
    transitionDuration: "0s",
  },
  ".rdg-row:hover .row-hover-iconButton": {
    color: theme.palette.text.primary,
    backgroundColor: alpha(
      theme.palette.action.hover,
      theme.palette.action.hoverOpacity * 1.5
    ),
  },

  ".cell-collapse-padding": {
    margin: theme.spacing(0, -1.25),
    width: `calc(100% + ${theme.spacing(1.25 * 2)})`,
  },

  ".rdg-row.out-of-order": {
    "--row-height": rowHeight + 1 + "px !important",
    marginTop: -1,
    marginBottom: OUT_OF_ORDER_MARGIN,
    borderBottomLeftRadius: theme.shape.borderRadius,

    "& .rdg-cell:not(:last-of-type)": {
      borderTop: `1px solid var(--border-color)`,
    },
    "& .rdg-cell:first-of-type": {
      borderBottomLeftRadius: theme.shape.borderRadius,
    },
    "& .rdg-cell:nth-last-of-type(2)": {
      borderBottomRightRadius: theme.shape.borderRadius,
    },
    "&:not(:nth-of-type(4))": {
      borderTopLeftRadius: theme.shape.borderRadius,

      "& .rdg-cell:first-of-type": {
        borderTopLeftRadius: theme.shape.borderRadius,
      },
      "& .rdg-cell:nth-last-of-type(2)": {
        borderTopRightRadius: theme.shape.borderRadius,
      },
    },

    "& + .rdg-row:not(.out-of-order)": {
      "--row-height": rowHeight + 1 + "px !important",
      marginTop: -1,
      borderTopLeftRadius: theme.shape.borderRadius,

      "& .rdg-cell:not(:last-of-type)": {
        borderTop: `1px solid var(--border-color)`,
      },
      "& .rdg-cell:first-of-type": {
        borderTopLeftRadius: theme.shape.borderRadius,
      },
      "& .rdg-cell:nth-last-of-type(2)": {
        borderTopRightRadius: theme.shape.borderRadius,
      },
    },
  },
}));
TableContainer.displayName = "TableContainer";

export default TableContainer;
