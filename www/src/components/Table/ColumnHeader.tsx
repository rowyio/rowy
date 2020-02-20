import React from "react";
import clsx from "clsx";
import { Column } from "react-data-grid";

import {
  makeStyles,
  createStyles,
  fade,
  Tooltip,
  Grid,
  IconButton,
  Typography,
} from "@material-ui/core";
import AddColumnIcon from "assets/icons/AddColumn";
import SortDescIcon from "@material-ui/icons/ArrowDownward";
import DropdownIcon from "@material-ui/icons/ArrowDropDownCircle";

import { getFieldIcon } from "constants/fields";
import { useFiretableContext } from "contexts/firetableContext";
import { FiretableOrderBy } from "hooks/useFiretable";

const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      marginTop: -1,
      height: "100%",
      "& svg, & button": { display: "block" },

      color: theme.palette.text.secondary,
      transition: theme.transitions.create("color", {
        duration: theme.transitions.duration.short,
      }),
      "&:hover": { color: theme.palette.text.primary },
    },

    addColumnButton: {
      backgroundColor: theme.palette.primary.contrastText,
      padding: 0,
      "& svg": { width: 32, height: 32 },

      opacity: 0.5,
      transition: theme.transitions.create("opacity", {
        duration: theme.transitions.duration.short,
      }),
      "&:hover": {
        backgroundColor: theme.palette.primary.contrastText,
        opacity: 1,
      },
    },

    columnNameContainer: {
      flexShrink: 1,
      overflow: "hidden",
      margin: theme.spacing(0, 0.5),
      marginRight: -26,
    },
    columnName: {
      fontSize: "0.875rem",
      lineHeight: 1,
    },

    sortIconContainer: {
      // backgroundColor: theme.palette.background.default,
      backgroundImage: `linear-gradient(to right, ${fade(
        theme.palette.background.default,
        0
      )} 0, ${theme.palette.background.default} 6px)`,
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
  } = useFiretableContext();
  if (!setSelectedColumnHeader || !tableState || !tableActions) return null;
  const { orderBy } = tableState;

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => setSelectedColumnHeader({ column, anchorEl: event.currentTarget });

  const isSorted = orderBy?.[0]?.key === column.key;
  const isAsc = isSorted && orderBy?.[0]?.direction === "asc";

  const handleSortClick = () => {
    if (isAsc) {
      const ordering: FiretableOrderBy = [
        { key: column.key, direction: "desc" },
      ];

      tableActions.table.orderBy(ordering);
    } else {
      const ordering: FiretableOrderBy = [
        { key: column.key, direction: "asc" },
      ];
      tableActions.table.orderBy(ordering);
    }
  };

  if (column.key === "new")
    return (
      <Grid
        container
        alignItems="center"
        justify="center"
        className={classes.root}
      >
        <Tooltip title="Add column">
          <IconButton
            size="small"
            // onClick={handleClick(props)}
            className={classes.addColumnButton}
            color="primary"
            aria-label="Add column"
            onClick={handleClick}
          >
            <AddColumnIcon />
          </IconButton>
        </Tooltip>
      </Grid>
    );

  return (
    <Grid container className={classes.root} alignItems="center" wrap="nowrap">
      <Tooltip title={column.key}>
        <Grid
          item
          onClick={() => {
            navigator.clipboard.writeText(column.key);
          }}
        >
          {getFieldIcon((column as any).type)}
        </Grid>
      </Tooltip>

      <Grid
        item
        xs
        onClick={() => {
          navigator.clipboard.writeText(column.key);
        }}
        className={classes.columnNameContainer}
      >
        <Typography
          variant="h6"
          noWrap
          className={classes.columnName}
          component="span"
          color="inherit"
        >
          {column.name}
        </Typography>
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
    </Grid>
  );
};

export default ColumnHeader;
