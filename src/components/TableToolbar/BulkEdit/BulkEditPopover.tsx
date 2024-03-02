import { Button, Popover, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useAtom } from "jotai";
import { bulkEditPopoverAtom, tableScope } from "@src/atoms/tableScope";
import { useRef } from "react";

export interface IBulkEditPopoverProps {
  children: (props: { handleClose: () => void }) => React.ReactNode;
}

export default function BulkEditPopover({ children }: IBulkEditPopoverProps) {
  const [{ open }, setBulkEditPopoverState] = useAtom(
    bulkEditPopoverAtom,
    tableScope
  );

  const handleClose = () => setBulkEditPopoverState({ open: false });
  const anchorEl = useRef<HTMLButtonElement>(null);
  const popoverId = open ? "bulkEdit-popover" : undefined;

  return (
    <>
      <Tooltip title="Bulk Edit">
        <Button
          ref={anchorEl}
          variant="outlined"
          startIcon={<EditIcon fontSize="small" />}
          color="secondary"
          onClick={() => setBulkEditPopoverState({ open: true })}
        >
          Bulk Edit
        </Button>
      </Tooltip>
      <Popover
        id={popoverId}
        open={open}
        anchorEl={anchorEl.current}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        sx={{
          "& .MuiPaper-root": { width: 440 },
          "& .content": { p: 3 },
        }}
      >
        {children({ handleClose })}
      </Popover>
    </>
  );
}
