import { useRef, useState } from "react";

import { Popover, Stack, Chip } from "@mui/material";
import FilterIcon from "@mui/icons-material/FilterList";

import ButtonWithStatus from "@src/components/ButtonWithStatus";

import type { TableFilter } from "@src/hooks/useTable";
import type { useFilterInputs } from "./useFilterInputs";

export interface IFiltersPopoverProps {
  appliedFilters: TableFilter[];
  hasAppliedFilters: boolean;
  hasTableFilters: boolean;
  tableFiltersOverridden: boolean;
  availableFilters: ReturnType<typeof useFilterInputs>["availableFilters"];
  setUserFilters: (filters: TableFilter[]) => void;

  children: (props: { handleClose: () => void }) => React.ReactNode;
}

export default function FiltersPopover({
  appliedFilters,
  hasAppliedFilters,
  hasTableFilters,
  tableFiltersOverridden,
  setUserFilters,
  availableFilters,
  children,
}: IFiltersPopoverProps) {
  const anchorEl = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const popoverId = open ? "filters-popover" : undefined;
  const handleClose = () => setOpen(false);

  return (
    <>
      <Stack direction="row" style={{ width: "auto" }}>
        <ButtonWithStatus
          ref={anchorEl}
          variant="outlined"
          color="primary"
          onClick={() => setOpen(true)}
          startIcon={<FilterIcon />}
          active={hasAppliedFilters}
          sx={
            hasAppliedFilters
              ? {
                  borderTopRightRadius: 0,
                  borderBottomRightRadius: 0,
                  position: "relative",
                  zIndex: 1,
                }
              : {}
          }
          aria-describedby={popoverId}
        >
          {hasAppliedFilters ? "Filtered" : "Filter"}
        </ButtonWithStatus>

        {appliedFilters.map((filter) => (
          <Chip
            key={filter.key}
            label={`${filter.key} ${filter.operator} ${
              availableFilters?.valueFormatter
                ? availableFilters.valueFormatter(filter.value)
                : filter.value
            }`}
            onDelete={
              hasTableFilters && !tableFiltersOverridden
                ? undefined
                : () => setUserFilters([])
            }
            sx={{
              borderRadius: 1,
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
              borderLeft: "none",

              backgroundColor: "background.paper",
              height: 32,

              "& .MuiChip-label": { px: 1.5 },
            }}
            variant="outlined"
          />
        ))}
      </Stack>

      <Popover
        id={popoverId}
        open={open}
        anchorEl={anchorEl.current}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        sx={{
          "& .MuiPaper-root": { width: 640 },
          "& .content": { p: 3 },
        }}
      >
        {children({ handleClose })}
      </Popover>
    </>
  );
}
