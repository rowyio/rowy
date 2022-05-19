import { useRef } from "react";
import { useAtom, useSetAtom } from "jotai";
import { HeaderRendererProps } from "react-data-grid";
import { useDrag, useDrop } from "react-dnd";
import useCombinedRefs from "@src/hooks/useCombinedRefs";

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

import { globalScope, userRolesAtom } from "@src/atoms/globalScope";
import {
  tableScope,
  tableOrdersAtom,
  updateColumnAtom,
} from "@src/atoms/tableScope";
import { FieldType } from "@src/constants/fields";
import { getFieldProp } from "@src/components/fields";
import { TableOrder } from "@src/types/table";
import { DEFAULT_ROW_HEIGHT } from "@src/components/Table";

export default function DraggableHeaderRenderer<R>({
  column,
}: HeaderRendererProps<R> & {
  onColumnsReorder: (sourceKey: string, targetKey: string) => void;
}) {
  const [userRoles] = useAtom(userRolesAtom, globalScope);
  const [tableOrders, setTableOrders] = useAtom(tableOrdersAtom, tableScope);
  const updateColumn = useSetAtom(updateColumnAtom, tableScope);

  const [{ isDragging }, drag] = useDrag({
    type: "COLUMN_DRAG",
    item: { key: column.key },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  // FIXME:
  // const [{ isOver }, drop] = useDrop({
  //   accept: "COLUMN_DRAG",
  //   drop: ({ key }) => {
  //     tableActions?.column.reorder(key, column.key);
  //   },
  //   collect: (monitor) => ({
  //     isOver: !!monitor.isOver(),
  //     canDrop: !!monitor.canDrop(),
  //   }),
  // });
  const isOver = false;

  const headerRef = useCombinedRefs(drag, drag /** FIXME: drop */);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleOpenMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    // FIXME:
    // columnMenuRef?.current?.setSelectedColumnHeader({
    //   column,
    //   anchorEl: buttonRef.current,
    // });
  };
  const _sortKey = getFieldProp("sortKey", (column as any).type);
  const sortKey = _sortKey ? `${column.key}.${_sortKey}` : column.key;

  const isSorted = tableOrders[0]?.key === sortKey;
  const isAsc = isSorted && tableOrders[0]?.direction === "asc";
  const isDesc = isSorted && tableOrders[0]?.direction === "desc";

  const handleSortClick = () => {
    let newOrders: TableOrder[] = [];

    if (!isSorted) newOrders = [{ key: sortKey, direction: "desc" }];
    else if (isDesc) newOrders = [{ key: sortKey, direction: "asc" }];
    else newOrders = [];

    setTableOrders(newOrders);
  };

  return (
    <Grid
      ref={headerRef}
      container
      alignItems="center"
      wrap="nowrap"
      onContextMenu={handleOpenMenu}
      sx={[
        {
          height: "100%",
          "& svg, & button": { display: "block" },

          color: "text.secondary",
          transition: (theme) =>
            theme.transitions.create("color", {
              duration: theme.transitions.duration.short,
            }),
          "&:hover": { color: "text.primary" },

          cursor: "move",

          py: 0,
          pr: 0.5,
          pl: 1,
          width: "100%",
        },
        isDragging
          ? { opacity: 0.5 }
          : isOver
          ? {
              backgroundColor: (theme) =>
                alpha(
                  theme.palette.primary.main,
                  theme.palette.action.focusOpacity
                ),
              color: "primary.main",
            }
          : {},
      ]}
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

      <Grid
        item
        xs
        sx={{ flexShrink: 1, overflow: "hidden", my: 0, ml: 0.5, mr: -30 / 8 }}
      >
        <Tooltip
          title={
            <Typography
              sx={{
                typography: "caption",
                fontWeight: "fontWeightMedium",
                lineHeight: `${DEFAULT_ROW_HEIGHT + 1}px`,
                textOverflow: "clip",
              }}
              color="inherit"
            >
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
          sx={{
            "& .MuiTooltip-tooltip": {
              background: "background.default",
              color: "text.primary",

              margin: `-${DEFAULT_ROW_HEIGHT}px 0 0 !important`,
              p: 0,
              pr: 1.5,

              "& *": { lineHeight: "40px" },
            },
          }}
        >
          <Typography
            noWrap
            sx={{
              typography: "caption",
              fontWeight: "fontWeightMedium",
              lineHeight: `${DEFAULT_ROW_HEIGHT + 1}px`,
              textOverflow: "clip",
            }}
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
          sx={{
            backgroundColor: "background.default",
            opacity: isSorted ? 1 : 0,
            transition: (theme) =>
              theme.transitions.create("opacity", {
                duration: theme.transitions.duration.shortest,
              }),

            "$root:hover &": { opacity: 1 },
          }}
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
              sx={{
                transition: (theme) =>
                  theme.transitions.create(["background-color", "transform"], {
                    duration: theme.transitions.duration.short,
                  }),
                transform: isAsc ? "rotate(180deg)" : "none",
              }}
            >
              <SortDescIcon />
            </IconButton>
          </Tooltip>
        </Grid>
      )}

      {(userRoles.includes("ADMIN") ||
        (userRoles.includes("OPS") &&
          [FieldType.multiSelect, FieldType.singleSelect].includes(
            (column as any).type
          ))) && (
        <Grid item>
          <Tooltip title="Column settings">
            <IconButton
              size="small"
              aria-label={`Column settings for ${column.name as string}`}
              color="inherit"
              onClick={handleOpenMenu}
              ref={buttonRef}
              sx={{
                transition: (theme) =>
                  theme.transitions.create("color", {
                    duration: theme.transitions.duration.short,
                  }),

                color: "text.disabled",
                "$root:hover &": { color: "text.primary" },
              }}
            >
              <DropdownIcon />
            </IconButton>
          </Tooltip>
        </Grid>
      )}
    </Grid>
  );
}
