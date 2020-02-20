import React from "react";
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
import ImportExportIcon from "@material-ui/icons/ImportExport";
import DropdownIcon from "@material-ui/icons/ArrowDropDownCircle";

import { getFieldIcon } from "constants/fields";

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
    },
    columnName: {
      fontSize: "0.875rem",
      lineHeight: 1,
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

  // const handleClick = (headerProps: any) => (
  //   event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  // ) => {
  //   handleCloseHeader();
  //   setAnchorEl(event.currentTarget);
  //   setHeader(headerProps);
  // };

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

      <Grid item>
        {/* <IconButton
            color={
              orderBy[0] && orderBy[0].key === column.key
                ? "primary"
                : "default"
            }
            disableFocusRipple={true}
            size="small"
            onClick={() => {
              console.log(
                orderBy,
                orderBy[0] && orderBy[0].key === column.key,
                orderBy[0] && orderBy[0].direction === "asc"
              );
              if (
                orderBy[0] &&
                orderBy[0].key === column.key &&
                orderBy[0].direction === "asc"
              ) {
                const ordering: FiretableOrderBy = [
                  { key: column.key, direction: "desc" },
                ];

                tableActions.table.orderBy(ordering);
                //setOrderBy(ordering) #BROKENINSIDE
              } else {
                const ordering: FiretableOrderBy = [
                  { key: column.key, direction: "asc" },
                ];
                tableActions.table.orderBy(ordering);
                //setOrderBy(ordering) #BROKENINSIDE
              }
            }}
          >
            <ImportExportIcon />
          </IconButton> */}
        <IconButton
          size="small"
          // onClick={handleClick(props)}
          className={classes.dropdownButton}
          aria-label={`Show ${column.name} column dropdown`}
          color="inherit"
        >
          <DropdownIcon />
        </IconButton>
      </Grid>
    </Grid>
  );
};

export default ColumnHeader;
