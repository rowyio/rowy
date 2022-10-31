import { useSetAtom } from "jotai";
import { colord } from "colord";

import { Tooltip, IconButton } from "@mui/material";
import SortDescIcon from "@mui/icons-material/ArrowDownward";
import IconSlash, {
  ICON_SLASH_STROKE_DASHOFFSET,
} from "@src/components/IconSlash";

import { tableScope, tableSortsAtom } from "@src/atoms/tableScope";

export const SORT_STATES = ["none", "desc", "asc"] as const;

export interface IColumnHeaderSortProps {
  sortKey: string;
  currentSort: typeof SORT_STATES[number];
  tabIndex?: number;
}

export default function ColumnHeaderSort({
  sortKey,
  currentSort,
  tabIndex,
}: IColumnHeaderSortProps) {
  const setTableSorts = useSetAtom(tableSortsAtom, tableScope);

  const nextSort =
    SORT_STATES[SORT_STATES.indexOf(currentSort) + 1] ?? SORT_STATES[0];

  const handleSortClick = () => {
    if (nextSort === "none") setTableSorts([]);
    else setTableSorts([{ key: sortKey, direction: nextSort }]);
  };

  return (
    <Tooltip
      title={nextSort === "none" ? "Unsort" : `Sort by ${nextSort}ending`}
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
          "[role='columnheader']:hover &, [role='columnheader']:focus &, [role='columnheader']:focus-within &, &:focus":
            { opacity: 1 },

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
}
