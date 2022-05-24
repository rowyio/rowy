import { makeStyles } from "tss-react/mui";

export const useStyles = makeStyles()((theme) => {
  let maxHeightDeductions = 0;
  maxHeightDeductions -= 64; // search box
  maxHeightDeductions -= 48; // multiple
  maxHeightDeductions += 8; // footer padding

  return {
    root: { minWidth: 200 },
    selectRoot: { paddingRight: theme.spacing(4) },

    paper: { overflow: "hidden", maxHeight: "calc(100% - 48px)" },
    menuChild: {
      padding: `0 ${theme.spacing(2)}`,
      minWidth: 340,
      // Need to set fixed height here so popup is positioned correctly
      height: 340,
    },

    grid: { outline: 0 },

    noMargins: { margin: 0 },

    searchRow: { marginTop: theme.spacing(2) },

    listRow: {
      background: `${theme.palette.background.paper} no-repeat`,
      position: "relative",
      margin: theme.spacing(0, -2),
      maxWidth: `calc(100% + ${theme.spacing(4)})`,

      "&::before, &::after": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9,

        display: "block",
        height: 16,

        background: `linear-gradient(to bottom, ${theme.palette.background.paper}, rgba(255, 255, 255, 0))`,
      },

      "&::after": {
        top: "auto",
        bottom: 0,
        background: `linear-gradient(to top, ${theme.palette.background.paper}, rgba(255, 255, 255, 0))`,
      },
    },
    list: {
      padding: theme.spacing(2, 0),
      overflowY: "auto",
      // height: `calc(340px - ${-maxHeightDeductions}px)`,
      height: 340 + maxHeightDeductions,
    },

    checkboxContainer: { minWidth: theme.spacing(36 / 8) },
    checkbox: {
      padding: theme.spacing(6 / 8, 9 / 8),
      "&:hover": { background: "transparent" },
    },

    divider: { margin: theme.spacing(0, 2, 0, 6.5) },

    footerRow: { marginBottom: theme.spacing(2) },
    selectedRow: {
      "$listRow + &": { marginTop: -theme.spacing(1) },
      "$footerRow + &": { marginTop: -theme.spacing(2) },

      marginBottom: 0,
      "& > div": { height: 48 },
    },
    selectAllButton: { marginRight: -theme.spacing(1) },
    selectedNum: { fontFeatureSettings: '"tnum"' },
  };
});

export default useStyles;
