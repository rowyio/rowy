import { useAtom } from "jotai";

import { Tooltip, IconButton } from "@mui/material";
import SortDescIcon from "@mui/icons-material/ArrowDownward";

import { tableScope, tableOrdersAtom } from "@src/atoms/tableScope";
import { FieldType } from "@src/constants/fields";
import { getFieldProp } from "@src/components/fields";

import { ColumnConfig } from "@src/types/table";

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
          position: "relative",
          backgroundColor: "background.default",
          opacity: currentSort !== "none" ? 1 : 0,
          ".column-header:hover &": { opacity: 1 },

          transition: (theme) =>
            theme.transitions.create(
              ["background-color", "transform", "opacity"],
              {
                duration: theme.transitions.duration.short,
              }
            ),
          transform: currentSort === "asc" ? "rotate(180deg)" : "none",

          "&:hover": {
            transform:
              currentSort === "asc" || nextSort === "asc"
                ? "rotate(180deg)"
                : "none",
          },

          "& .slash": { opacity: currentSort === "none" ? 1 : 0 },
          "&:hover .slash": { opacity: nextSort === "none" ? 1 : 0 },
        }}
      >
        <SortDescIcon />

        <svg
          viewBox="0 0 24 24"
          style={{
            fill: "currentColor",
            position: "absolute",
            top: (32 - 24) / 2,
            left: (32 - 24) / 2,
          }}
          className="slash"
        >
          <polygon points="0 1.27 1.28 0 21 19.73 19.73 21" />
        </svg>
      </IconButton>
    </Tooltip>
  );
}
