import { useRef } from "react";
import { useAtom } from "jotai";

import { Popover, Stack, Chip, Typography } from "@mui/material";
import FilterIcon from "@mui/icons-material/FilterList";

import ButtonWithStatus from "@src/components/ButtonWithStatus";

import { tableScope, tableFiltersPopoverAtom } from "@src/atoms/tableScope";
import type { TableFilter } from "@src/types/table";
import type { useFilterInputs } from "./useFilterInputs";

export interface IFiltersPopoverProps {
  appliedFilters: TableFilter[];
  hasAppliedFilters: boolean;
  hasTableFilters: boolean;
  tableFiltersOverridden: boolean;
  availableFilters: ReturnType<
    typeof useFilterInputs
  >["availableFiltersForEachSelectedColumn"][0];
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
  const [{ open }, setTableFiltersPopoverState] = useAtom(
    tableFiltersPopoverAtom,
    tableScope
  );

  const anchorEl = useRef<HTMLButtonElement>(null);
  const popoverId = open ? "filters-popover" : undefined;
  const handleClose = () => setTableFiltersPopoverState({ open: false });

  return (
    <>
      <Stack direction="row" style={{ width: "auto" }}>
        <ButtonWithStatus
          ref={anchorEl}
          variant="outlined"
          color="primary"
          onClick={() => setTableFiltersPopoverState({ open: true })}
          startIcon={<FilterIcon />}
          active={hasAppliedFilters}
          style={
            appliedFilters.length === 1
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
          {hasAppliedFilters ? `Filtered: ${appliedFilters.length}` : "Filter"}
        </ButtonWithStatus>

        {appliedFilters.length === 1 &&
          appliedFilters.map((filter) => {
            const fieldName = filter.key === "_rowy_ref.id" ? "ID" : filter.key;
            const operator = (availableFilters?.operators ?? []).find(
              (f) => f.value === filter.operator
            );
            const operatorLabel = (operator?.label ?? filter.operator).replace(
              "id-equal",
              "is"
            );

            const formattedValue = availableFilters?.valueFormatter
              ? availableFilters.valueFormatter(filter.value, filter.operator)
              : filter.value.toString();

            return (
              <Chip
                key={filter.key}
                label={
                  <Typography variant="inherit" component="span">
                    {fieldName}{" "}
                    <Typography
                      variant="inherit"
                      display="inline"
                      color="text.secondary"
                      fontWeight="normal"
                    >
                      {operatorLabel}
                    </Typography>{" "}
                    {formattedValue}
                  </Typography>
                }
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
            );
          })}
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
