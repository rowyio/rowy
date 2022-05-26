import { useState } from "react";
import { useSetAtom } from "jotai";
import { IColumnModalProps } from ".";

import Modal from "@src/components/Modal";
import FieldsDropdown from "./FieldsDropdown";

import { tableScope, updateColumnAtom } from "@src/atoms/tableScope";
import { FieldType } from "@src/constants/fields";
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
      children={<FieldsDropdown value={newType} onChange={setType} />}
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
