import { useRef } from "react";
import clsx from "clsx";
import { HeaderRendererProps } from "react-data-grid";
import { useDrag, useDrop, DragObjectWithType } from "react-dnd";
import useCombinedRefs from "@src/hooks/useCombinedRefs";

import { makeStyles, createStyles } from "@mui/styles";
import {
  alpha,
  Tooltip,
  Fade,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import SortDescIcon from "@mui/icons-material/ArrowDownward";
import DropdownIcon from "@mui/icons-material/MoreHoriz";
import LockIcon from "@mui/icons-material/LockOutlined";

import { FieldType } from "@src/constants/fields";
import { getFieldProp } from "@src/components/fields";
import { useAppContext } from "@src/contexts/AppContext";
import { useProjectContext } from "@src/contexts/ProjectContext";
import { TableOrder } from "@src/hooks/useTable";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      height: "100%",
      "& svg, & button": { display: "block" },

      color: theme.palette.text.secondary,
      transition: theme.transitions.create("color", {
        duration: theme.transitions.duration.short,
      }),
      "&:hover": { color: theme.palette.text.primary },

      cursor: "move",

      padding: theme.spacing(0, 0.5, 0, 1),
      width: "100%",
    },
    isDragging: { opacity: 0.5 },
    isOver: {
      backgroundColor: alpha(
        theme.palette.primary.main,
        theme.palette.action.focusOpacity
      ),
      color: theme.palette.primary.main,
    },

    columnNameContainer: {
      flexShrink: 1,
      overflow: "hidden",
      margin: theme.spacing(0, 0.5),
      marginRight: -30,
    },
    columnName: {
      ...theme.typography.caption,
      fontWeight: theme.typography.fontWeightMedium,
      lineHeight: "42px",
      textOverflow: "clip",
    },

    columnNameTooltip: {
      background: theme.palette.background.default,
      color: theme.palette.text.primary,

      margin: "-41px 0 0 !important",
      padding: theme.spacing(0, 1.5, 0, 0),

      "& *": { lineHeight: "40px" },
    },

    sortIconContainer: {
      backgroundColor: theme.palette.background.default,
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
      transition: theme.transitions.create("color", {
        duration: theme.transitions.duration.short,
      }),

      color: theme.palette.text.disabled,
      "$root:hover &": { color: theme.palette.text.primary },
    },
  })
);

interface ColumnDragObject extends DragObjectWithType {
  key: string;
}

export default function DraggableHeaderRenderer<R>({
  column,
}: HeaderRendererProps<R> & {
  onColumnsReorder: (sourceKey: string, targetKey: string) => void;
}) {
  const classes = useStyles();
  const { userClaims } = useAppContext();
  const { tableState, tableActions, columnMenuRef } = useProjectContext();
  const [{ isDragging }, drag] = useDrag({
    item: { key: column.key, type: "COLUMN_DRAG" },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: "COLUMN_DRAG",
    drop({ key, type }: ColumnDragObject) {
      if (type === "COLUMN_DRAG") {
        // onColumnsReorder(key, props.column.key);
        tableActions?.column.reorder(key, column.key);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  });

  const headerRef = useCombinedRefs(drag, drop);
  const buttonRef = useRef<HTMLButtonElement>(null);

  if (!columnMenuRef || !tableState || !tableActions) return null;
  const { orderBy } = tableState;

  const handleOpenMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    columnMenuRef?.current?.setSelectedColumnHeader({
      column,
      anchorEl: buttonRef.current,
    });
  };
  const _sortKey = getFieldProp("sortKey", (column as any).type);
  const sortKey = _sortKey ? `${column.key}.${_sortKey}` : column.key;

  const isSorted = orderBy?.[0]?.key === sortKey;
  const isAsc = isSorted && orderBy?.[0]?.direction === "asc";
  const isDesc = isSorted && orderBy?.[0]?.direction === "desc";

  const handleSortClick = () => {
    let ordering: TableOrder = [];

    if (!isSorted) ordering = [{ key: sortKey, direction: "desc" }];
    else if (isDesc) ordering = [{ key: sortKey, direction: "asc" }];
    else ordering = [];

    tableActions.table.orderBy(ordering);
  };

  return (
    <Grid
      ref={headerRef}
      container
      className={clsx(
        classes.root,
        isDragging && classes.isDragging,
        isOver && !isDragging && classes.isOver
      )}
      alignItems="center"
      wrap="nowrap"
      onContextMenu={handleOpenMenu}
    >
      {(column.width as number) > 140 && (
        <Tooltip
          title={
            <>
              Click to copy field key:
              <br />
              <code style={{ padding: 0 }}>{column.key}</code>
            </>
          }
          enterDelay={1000}
          placement="bottom-start"
        >
          <Grid
            item
            onClick={() => {
              navigator.clipboard.writeText(column.key);
            }}
          >
            {column.editable === false ? (
              <LockIcon />
            ) : (
              getFieldProp("icon", (column as any).type)
            )}
          </Grid>
        </Tooltip>
      )}

      <Grid item xs className={classes.columnNameContainer}>
        <Tooltip
          title={
            <Typography className={classes.columnName} color="inherit">
              {column.name as string}
            </Typography>
          }
          enterDelay={1000}
          placement="bottom-start"
          disableInteractive
          // PopperProps={{
          //   modifiers: [
          //     {
          //       name: "flip",
          //       options: {
          //         enabled: false,
          //       },
          //     },
          //     {
          //       name: "preventOverflow",
          //       options: {
          //         enabled: false,
          //         boundariesElement: "scrollParent",
          //       },
          //     },
          //     {
          //       name: "hide",
          //       options: {
          //         enabled: false,
          //       },
          //     },
          //   ],
          // }}
          TransitionComponent={Fade}
          classes={{ tooltip: classes.columnNameTooltip }}
        >
          <Typography
            noWrap
            className={classes.columnName}
            component="div"
            color="inherit"
          >
            {column.name as string}
          </Typography>
        </Tooltip>
      </Grid>

      {(column as any).type !== FieldType.id && (
        <Grid
          item
          className={clsx(
            classes.sortIconContainer,
            isSorted && classes.sortIconContainerSorted
          )}
        >
          <Tooltip
            title={
              isAsc
                ? "Unsort"
                : `Sort by ${isDesc ? "ascending" : "descending"}`
            }
          >
            <IconButton
              disableFocusRipple={true}
              size="small"
              onClick={handleSortClick}
              color="inherit"
              aria-label={
                isAsc
                  ? "Unsort"
                  : `Sort by ${isDesc ? "ascending" : "descending"}`
              }
              className={clsx(classes.sortIcon, isAsc && classes.sortIconAsc)}
            >
              <SortDescIcon />
            </IconButton>
          </Tooltip>
        </Grid>
      )}

      {(userClaims?.roles?.includes("ADMIN") ||
        (userClaims?.roles?.includes("OPS") &&
          [FieldType.multiSelect, FieldType.singleSelect].includes(
            (column as any).type
          ))) && (
        <Grid item>
          <Tooltip title="Column settings">
            <IconButton
              size="small"
              className={classes.dropdownButton}
              aria-label={`Column settings for ${column.name as string}`}
              color="inherit"
              onClick={handleOpenMenu}
              ref={buttonRef}
            >
              <DropdownIcon />
            </IconButton>
          </Tooltip>
        </Grid>
      )}
    </Grid>
  );
  //   return (
  //     <div
  //       ref={useCombinedRefs(drag, drop)}
  //       style={{
  //         opacity: isDragging ? 0.5 : 1,
  //         backgroundColor: isOver ? '#ececec' : 'inherit',
  //         cursor: 'move'
  //       }}
  //     >
  //       {props.column.name as string}
  //     </div>
  //   );
}
