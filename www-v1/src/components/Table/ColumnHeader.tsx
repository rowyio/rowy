import { useRef } from "react";
import clsx from "clsx";
import { HeaderRendererProps } from "react-data-grid";
import { useDrag, useDrop, DragObjectWithType } from "react-dnd";
import { useCombinedRefs } from "react-data-grid/lib/hooks";

import { makeStyles, createStyles } from "@material-ui/styles";
import {
  alpha,
  Tooltip,
  Fade,
  Grid,
  IconButton,
  Typography,
} from "@material-ui/core";
import SortDescIcon from "@material-ui/icons/ArrowDownward";
import DropdownIcon from "@material-ui/icons/ArrowDropDownCircle";

import { FieldType } from "constants/fields";
import { getFieldProp } from "components/fields";
import { useFiretableContext } from "contexts/FiretableContext";
import { FiretableOrderBy } from "hooks/useFiretable";

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

      margin: theme.spacing(0, -1.5),
      padding: theme.spacing(0, 1.5),
      width: `calc(100% + ${theme.spacing(1.5 * 2)})`,
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
      marginRight: -26,
    },
    columnName: { lineHeight: "44px" },

    columnNameTooltip: {
      background: theme.palette.background.default,
      color: theme.palette.text.primary,

      margin: "-43px 0 0 !important",
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

interface ColumnDragObject extends DragObjectWithType {
  key: string;
}

export default function DraggableHeaderRenderer<R>({
  column,
}: HeaderRendererProps<R> & {
  onColumnsReorder: (sourceKey: string, targetKey: string) => void;
}) {
  const classes = useStyles();

  const {
    tableState,
    tableActions,
    userClaims,
    columnMenuRef,
  } = useFiretableContext();
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
      <Tooltip
        title={
          <>
            Click to copy field key:
            <Typography
              variant="subtitle2"
              component="div"
              sx={{ fontFamily: "fontFamilyMono" }}
            >
              {column.key as string}
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
          {getFieldProp("icon", (column as any).type)}
        </Grid>
      </Tooltip>

      <Grid item xs className={classes.columnNameContainer}>
        <Tooltip
          title={<Typography variant="subtitle2">{column.name}</Typography>}
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
            variant="subtitle2"
            noWrap
            className={classes.columnName}
            component="div"
            color="inherit"
          >
            {column.name}
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
      )}

      {(userClaims?.roles?.includes("ADMIN") ||
        (userClaims?.roles?.includes("OPS") &&
          [FieldType.multiSelect, FieldType.singleSelect].includes(
            (column as any).type
          ))) && (
        <Grid item>
          <IconButton
            size="small"
            className={classes.dropdownButton}
            aria-label={`Show ${column.name} column dropdown`}
            color="inherit"
            onClick={handleOpenMenu}
            ref={buttonRef}
          >
            <DropdownIcon />
          </IconButton>
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
  //       {props.column.name}
  //     </div>
  //   );
}
