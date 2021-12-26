import { useEffect, useState } from "react";
import { IMenuModalProps } from ".";

import { TextField } from "@mui/material";

import Modal from "@src/components/Modal";
import useTableConfig from "@src/hooks/useTable/useTableConfig";
import { useProjectContext } from "@src/contexts/ProjectContext";
import { ConnectingAirportsOutlined } from "@mui/icons-material";

interface IResizeColumn extends IMenuModalProps {
  data: any;
}

export default function ResizeColumn({
  open,
  handleClose,
  data,
}: IResizeColumn) {
  const { tableActions, tableState } = useProjectContext();
  const [error, setError] = useState(false);
  const [newWidth, setWidth] = useState<number>();
  const width = tableState?.columns[data.key]?.width;
  const hasWidth = Boolean(width);

  const handleResizeCol = () =>
    tableActions?.column.singleResize(data.key, newWidth!);

  useEffect(() => {
    // Set the width because
    // useState only initalize on first Render and
    // data does not appear on first render
    if (!hasWidth) return;
    setWidth(width);
  }, [width]);

  useEffect(() => {
    const hasValidWidth = newWidth! > 0;
    if (hasValidWidth) setError(false);
    else setError(true);
  }, [newWidth]);

  if (!open) return null;
  return (
    <Modal
      onClose={handleClose}
      title="Resize column width"
      maxWidth="xs"
      children={
        <TextField
          error={error}
          helperText={"Width cannot be negative"} //
          value={newWidth}
          autoFocus
          variant="filled"
          id="column-width"
          label="Column width"
          type="number"
          fullWidth
          onChange={(e) => {
            setWidth(parseInt(e.target.value));
          }}
        />
      }
      actions={{
        primary: {
          onClick: () => {
            if (error) return;
            handleResizeCol();
            handleClose();
          },
          children: "Update",
        },
        secondary: {
          onClick: handleClose,
          children: "Cancel",
        },
      }}
    />
  );
}
