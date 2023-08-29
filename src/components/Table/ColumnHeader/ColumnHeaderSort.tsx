import { memo } from "react";
import { useSetAtom } from "jotai";
import { colord } from "colord";

import { Tooltip, IconButton } from "@mui/material";
import SortDescIcon from "@mui/icons-material/ArrowDownward";
import IconSlash, {
  ICON_SLASH_STROKE_DASHOFFSET,
} from "@src/components/IconSlash";

import { tableScope, tableSortsAtom } from "@src/atoms/tableScope";
import useSaveTableSorts from "./useSaveTableSorts";

export const SORT_STATES = ["none", "desc", "asc"] as const;

export interface IColumnHeaderSortProps {
  sortKey: string;
  currentSort: typeof SORT_STATES[number];
  tabIndex?: number;
  canEditColumns: boolean;
}

/**
 * Renders button with current sort state.
 * On click, updates `tableSortsAtom` in `tableScope`.
 */
export const ColumnHeaderSort = memo(function ColumnHeaderSort({
  sortKey,
  currentSort,
  tabIndex,
  canEditColumns,
}: IColumnHeaderSortProps) {
  const setTableSorts = useSetAtom(tableSortsAtom, tableScope);

  const nextSort =
    SORT_STATES[SORT_STATES.indexOf(currentSort) + 1] ?? SORT_STATES[0];

  const triggerSaveTableSorts = useSaveTableSorts(canEditColumns);

  const handleSortClick = () => {
    setTableSorts(
      nextSort === "none" ? [] : [{ key: sortKey, direction: nextSort }]
    );
    triggerSaveTableSorts(
      nextSort === "none" ? [] : [{ key: sortKey, direction: nextSort }]
    );
  };

  return (
    <Tooltip
      title={nextSort === "none" ? "Remove sort" : `Sort by ${nextSort}ending`}
    >
      <IconButton
        disableFocusRipple={true}
        size="small"
        onClick={handleSortClick}
        color="inherit"
        tabIndex={tabIndex}
        sx={{
          bgcolor: "background.default",
          "&:hover, &:focus": {
            backgroundColor: (theme) =>
              colord(theme.palette.background.default)
                .mix(
                  theme.palette.action.hover,
                  theme.palette.action.hoverOpacity
                )
                .alpha(1)
                .toHslString(),

            "& .icon-slash-mask": {
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

          "& .arrow": {
            transition: (theme) =>
              theme.transitions.create("transform", {
                duration: theme.transitions.duration.short,
              }),

            transform: currentSort === "asc" ? "rotate(180deg)" : "none",
          },
          "&:hover .arrow, &:focus .arrow": {
            transform:
              currentSort === "asc" || nextSort === "asc"
                ? "rotate(180deg)"
                : "none",
          },

          "& .icon-slash": {
            strokeDashoffset:
              currentSort === "none" ? 0 : ICON_SLASH_STROKE_DASHOFFSET,
          },
          "&:hover .icon-slash, &:focus .icon-slash": {
            strokeDashoffset:
              nextSort === "none" ? 0 : ICON_SLASH_STROKE_DASHOFFSET,
          },
        }}
      >
        <div style={{ position: "relative" }}>
          <SortDescIcon className="arrow" />
          <IconSlash />
        </div>
      </IconButton>
    </Tooltip>
  );
});

export default ColumnHeaderSort;
