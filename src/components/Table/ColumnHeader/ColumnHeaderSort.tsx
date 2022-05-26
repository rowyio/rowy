import { useAtom } from "jotai";

import { Tooltip, IconButton } from "@mui/material";
import SortDescIcon from "@mui/icons-material/ArrowDownward";

import { tableScope, tableOrdersAtom } from "@src/atoms/tableScope";
import { FieldType } from "@src/constants/fields";
import { getFieldProp } from "@src/components/fields";

import { ColumnConfig } from "@src/types/table";

import { colord, extend } from "colord";
import mixPlugin from "colord/plugins/lch";
extend([mixPlugin]);

const SORT_STATES = ["none", "desc", "asc"] as const;

export interface IColumnHeaderSortProps {
  column: ColumnConfig;
}

export default function ColumnHeaderSort({ column }: IColumnHeaderSortProps) {
  const [tableOrders, setTableOrders] = useAtom(tableOrdersAtom, tableScope);

  const _sortKey = getFieldProp("sortKey", (column as any).type);
  const sortKey = _sortKey ? `${column.key}.${_sortKey}` : column.key;

  const currentSort: typeof SORT_STATES[number] =
    tableOrders[0]?.key !== sortKey
      ? "none"
      : tableOrders[0]?.direction || "none";
  const nextSort =
    SORT_STATES[SORT_STATES.indexOf(currentSort) + 1] ?? SORT_STATES[0];

  const handleSortClick = () => {
    if (nextSort === "none") setTableOrders([]);
    else setTableOrders([{ key: sortKey, direction: nextSort }]);
  };

  if (column.type === FieldType.id) return null;

  return (
    <Tooltip
      title={nextSort === "none" ? "Unsort" : `Sort by ${nextSort}ending`}
    >
      <IconButton
        disableFocusRipple={true}
        size="small"
        onClick={handleSortClick}
        color="inherit"
        sx={{
          bgcolor: "background.default",
          "& .slash-mask": {
            stroke: (theme) => theme.palette.background.default,
          },
          "&:hover": {
            backgroundColor: (theme) =>
              colord(theme.palette.background.default)
                .mix(
                  theme.palette.action.hover,
                  theme.palette.action.hoverOpacity
                )
                .alpha(1)
                .toHslString(),

            "& .slash-mask": {
              stroke: (theme) =>
                colord(theme.palette.background.default)
                  .mix(
                    theme.palette.action.hover,
                    theme.palette.action.hoverOpacity
                  )
                  .alpha(1)
                  .toHslString(),
            },
          },

          position: "relative",
          opacity: currentSort !== "none" ? 1 : 0,
          ".column-header:hover &": { opacity: 1 },

          transition: (theme) =>
            theme.transitions.create(["background-color", "opacity"], {
              duration: theme.transitions.duration.short,
            }),

          "& .arrow": {
            transition: (theme) =>
              theme.transitions.create("transform", {
                duration: theme.transitions.duration.short,
              }),

            transform: currentSort === "asc" ? "rotate(180deg)" : "none",
          },
          "&:hover .arrow": {
            transform:
              currentSort === "asc" || nextSort === "asc"
                ? "rotate(180deg)"
                : "none",
          },

          "& .slash": {
            transition: (theme) =>
              theme.transitions.create("stroke-dashoffset", {
                duration: theme.transitions.duration.short,
              }),
            strokeDasharray: 27.9,
            strokeDashoffset: currentSort === "none" ? 0 : 27.9,
          },
          "&:hover .slash": {
            strokeDashoffset: nextSort === "none" ? 0 : 27.9,
          },
        }}
      >
        <SortDescIcon className="arrow" />

        <svg
          viewBox="0 0 24 24"
          style={{
            stroke: "currentColor",
            strokeWidth: 2,
            position: "absolute",
            inset: (32 - 24) / 2,
          }}
          className="slash"
        >
          <line
            className="slash-mask"
            x1="3.08"
            y1="1.04"
            x2="22.8633788"
            y2="20.7130253"
          />

          <line x1="1.75" y1="2.365" x2="21.475" y2="22.095" />
        </svg>
      </IconButton>
    </Tooltip>
  );
}
