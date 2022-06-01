import { useState } from "react";
import { useSetAtom } from "jotai";
import { IColumnModalProps } from ".";

import Modal from "@src/components/Modal";
import FieldsDropdown from "./FieldsDropdown";
import { Alert, AlertTitle } from "@mui/material";

import { tableScope, updateColumnAtom } from "@src/atoms/tableScope";
import { FieldType } from "@src/constants/fields";
import { getFieldProp } from "@src/components/fields";
import { analytics, logEvent } from "analytics";

export default function TypeChangeModal({
  handleClose,
  column,
}: IColumnModalProps) {
  const updateColumn = useSetAtom(updateColumnAtom, tableScope);
  const [newType, setType] = useState<FieldType>(column.type);

  return (
    <Modal
      onClose={handleClose}
      title="Change column type"
      children={
        <>
          <FieldsDropdown value={newType} onChange={setType} />

          {getFieldProp("dataType", column.type) !==
            getFieldProp("dataType", newType) && (
            <Alert severity="warning">
              <AlertTitle>Potential data loss</AlertTitle>
              {getFieldProp("name", newType)} has an incompatible data type.
              Selecting this can result in data loss.
            </Alert>
          )}
        </>
      }
      actions={{
        primary: {
          onClick: () => {
            const prevType = column.type;
            updateColumn({ key: column.key, config: { type: newType } });
            handleClose();
            logEvent(analytics, "change_column_type", { newType, prevType });
          },
          children: "Update",
        },
      }}
      maxWidth="xs"
    />
  );
}
