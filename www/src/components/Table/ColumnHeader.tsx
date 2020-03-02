import React from "react";
import clsx from "clsx";
import { Column } from "react-data-grid";

import {
  makeStyles,
  createStyles,
  Tooltip,
  Fade,
  Grid,
  IconButton,
  Typography,
} from "@material-ui/core";
import SortDescIcon from "@material-ui/icons/ArrowDownward";
import DropdownIcon from "@material-ui/icons/ArrowDropDownCircle";

import { getFieldIcon } from "constants/fields";
import { useFiretableContext } from "contexts/firetableContext";
import { FiretableOrderBy } from "hooks/useFiretable";

const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      height: "100%",
      "& svg, & button": { display: "block" },

      color: theme.palette.text.secondary,
      transition: theme.transitions.create("color", {
        duration: theme.transitions.duration.short,
      }),
      "&:hover": { color: theme.palette.text.primary },
    },

    columnNameContainer: {
      flexShrink: 1,
      overflow: "hidden",
      margin: theme.spacing(0, 0.5),
      marginRight: -26,
    },
    columnName: { lineHeight: "44px" },

    columnNameTooltip: {
      background: theme.palette.background.default,
      color: theme.palette.text.primary,

      margin: "-43px 0 0",
      padding: theme.spacing(0, 1.5, 0, 0),

      "& *": { lineHeight: "42px" },
    },

    sortIconContainer: {
      backgroundColor: theme.palette.background.default,
      width: 30,
      height: 30,

      opacity: 0,
      transition: theme.transitions.create("opacity", {
        duration: theme.transitions.duration.shortest,
      }),
      "$root:hover &": { opacity: 1 },
    },
    sortIconContainerSorted: { opacity: 1 },

    sortIcon: {
      transition: theme.transitions.create(["background-color", "transform"], {
        duration: theme.transitions.duration.short,
      }),
    },
    sortIconAsc: {
      transform: "rotate(180deg)",
    },

    dropdownButton: {
      opacity: 0.5,
      transition: theme.transitions.create("opacity", {
        duration: theme.transitions.duration.short,
      }),
      "&:hover": {
        backgroundColor: "transparent",
        opacity: 1,
      },

      padding: 0,
    },
  })
);

const ColumnHeader: Column<any>["headerRenderer"] = ({ column }) => {
  const classes = useStyles();

  const {
    setSelectedColumnHeader,
    tableState,
    tableActions,
    userClaims,
  } = useFiretableContext();
  if (!setSelectedColumnHeader || !tableState || !tableActions) return null;
  const { orderBy } = tableState;

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => setSelectedColumnHeader({ column, anchorEl: event.currentTarget });

  const isSorted = orderBy?.[0]?.key === (column.key as string);
  const isAsc = isSorted && orderBy?.[0]?.direction === "asc";

  const handleSortClick = () => {
    if (isAsc) {
      const ordering: FiretableOrderBy = [
        { key: column.key as string, direction: "desc" },
      ];

      tableActions.table.orderBy(ordering);
    } else {
      const ordering: FiretableOrderBy = [
        { key: column.key as string, direction: "asc" },
      ];
      tableActions.table.orderBy(ordering);
    }
  };

  return (
    <Grid container className={classes.root} alignItems="center" wrap="nowrap">
      <Tooltip
        title={
          <>
            <Typography variant="caption" component="p">
              {column.key as string}
            </Typography>
            <Typography variant="body2" component="p">
              <small>(Click to copy)</small>
            </Typography>
          </>
        }
        enterDelay={1000}
        placement="bottom-start"
      >
        <Grid
          item
          onClick={() => {
            navigator.clipboard.writeText(column.key as string);
          }}
        >
          {getFieldIcon((column as any).type)}
        </Grid>
      </Tooltip>

      <Grid item xs className={classes.columnNameContainer}>
        <Tooltip
          title={<Typography variant="caption">{column.name}</Typography>}
          enterDelay={1000}
          placement="bottom-start"
          PopperProps={{
            modifiers: {
              flip: { enabled: false },
              preventOverflow: {
                enabled: false,
                boundariesElement: "scrollParent",
              },
              hide: { enabled: false },
            },
          }}
          TransitionComponent={Fade}
          classes={{ tooltip: classes.columnNameTooltip }}
        >
          <Typography
            variant="caption"
            noWrap
            className={classes.columnName}
            component="div"
            color="inherit"
          >
            {column.name}
          </Typography>
        </Tooltip>
      </Grid>

      <Grid
        item
        className={clsx(
          classes.sortIconContainer,
          isSorted && classes.sortIconContainerSorted
        )}
      >
        <IconButton
          disableFocusRipple={true}
          size="small"
          onClick={handleSortClick}
          color="inherit"
          aria-label={`Sort by ${isAsc ? "descending" : "ascending"}`}
          className={clsx(classes.sortIcon, isAsc && classes.sortIconAsc)}
        >
          <SortDescIcon />
        </IconButton>
      </Grid>

      {userClaims?.roles?.includes("ADMIN") && (
        <Grid item>
          <IconButton
            size="small"
            className={classes.dropdownButton}
            aria-label={`Show ${column.name} column dropdown`}
            color="inherit"
            onClick={handleClick}
          >
            <DropdownIcon />
          </IconButton>
        </Grid>
      )}
    </Grid>
  );
};

export default ColumnHeader;
