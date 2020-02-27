import { makeStyles, createStyles } from "@material-ui/core";

interface StylesProps {
  searchable: boolean;
  freeText: boolean;
  multiple: boolean;
  width?: number;
}

export const useStyles = makeStyles(theme =>
  createStyles({
    root: { minWidth: 200 },
    selectRoot: { paddingRight: theme.spacing(4) },

    paper: { overflow: "hidden", maxHeight: "calc(100% - 48px)" },
    popupContentsWrapper: { outline: 0 },
    menuChild: {
      padding: `0 ${theme.spacing(2)}px`,
      width: ({ width }: StylesProps) => width || 480,
      maxWidth: `calc(100vw - ${theme.spacing(4)}px)`,
      minWidth: 240,
    },

    noMargins: { margin: 0 },

    searchRow: { marginTop: theme.spacing(2) },

    chipListRow: {
      background: `${theme.palette.background.paper} no-repeat`,
      backgroundImage:
        "linear-gradient(to bottom, rgba(255,255,255,1), rgba(255,255,255,0)), linear-gradient(to top, rgba(255,255,255,1), rgba(255,255,255,0))",
      backgroundPosition: `-12px 0, -24px 100%`,
      backgroundSize: `calc(100% + 12px + 12px) 16px`,

      position: "relative",

      "&::before, &::after": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9,

        display: "block",
        height: 16,

        background: `linear-gradient(to bottom, #fff, rgba(255, 255, 255, 0))`,
      },

      "&::after": {
        top: "auto",
        bottom: 0,
        background: `linear-gradient(to top, #fff, rgba(255, 255, 255, 0))`,
      },
    },
    chipList: ({ searchable, freeText, multiple }: StylesProps) => {
      let maxHeightDeductions = 0;
      if (searchable) maxHeightDeductions -= 64;
      if (multiple) maxHeightDeductions -= 48;
      if (freeText) maxHeightDeductions -= 48;
      if (freeText && !multiple) maxHeightDeductions -= theme.spacing(2);

      return {
        margin: `0px -${theme.spacing(2)}px`,
        padding: `12px ${theme.spacing(2) - theme.spacing(0.5)}px`,
        overflowY: "auto" as "auto",
        maxHeight: `calc(100vh - 48px - ${-maxHeightDeductions}px)`,
      };
    },
    chip: {
      margin: theme.spacing(0.5),
      // Allow multi-line chip
      maxWidth: `calc(100% - ${theme.spacing(1)}px)`,
    },
    selectedChip: { backgroundColor: theme.palette.divider },

    footerRow: { marginBottom: theme.spacing(2) },
    addCustomButton: { marginLeft: -theme.spacing(1) },
    selectedRow: {
      "$chipListRow + &": { marginTop: -theme.spacing(1) },
      "$footerRow + &": { marginTop: -theme.spacing(2) },

      marginBottom: 0,
      "& > div": { height: 48 },
    },
    selectAllButton: { marginRight: -theme.spacing(1) },
    selectedNum: { fontFeatureSettings: '"tnum"' },

    measureChip: {
      visibility: "hidden",
      position: "absolute",
      top: 0,
      left: 0,
    },
  })
);

export default useStyles;
