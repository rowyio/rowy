import { useRef, useState } from "react";
import { useAtom } from "jotai";

import { Popover } from "@mui/material";

import ButtonWithStatus from "@src/components/ButtonWithStatus";

import { tableScope, tableSortsAtom } from "@src/atoms/tableScope";

import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

export interface ISortPopoverProps {
  children: (props: { handleClose: () => void }) => React.ReactNode;
}

export default function SortPopover({ children }: ISortPopoverProps) {
  const [tableSortPopoverState, setTableSortPopoverState] = useState(false);

  const anchorEl = useRef<HTMLButtonElement>(null);
  const popoverId = tableSortPopoverState ? "sort-popover" : undefined;
  const handleClose = () => setTableSortPopoverState(false);

  const [tableSorts] = useAtom(tableSortsAtom, tableScope);

  return (
    <>
      <ButtonWithStatus
        ref={anchorEl}
        variant="outlined"
        color="primary"
        onClick={() => setTableSortPopoverState(true)}
        active={true}
        startIcon={
          <ArrowDownwardIcon
            sx={{
              transition: (theme) =>
                theme.transitions.create("transform", {
                  duration: theme.transitions.duration.short,
                }),

              transform:
                tableSorts[0].direction === "asc" ? "rotate(180deg)" : "none",
            }}
          />
        }
        aria-describedby={popoverId}
      >
        Sorted: {tableSorts[0].key}
      </ButtonWithStatus>

      <Popover
        id={popoverId}
        open={tableSortPopoverState}
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
