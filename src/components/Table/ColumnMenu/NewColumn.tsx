import { useState, useEffect } from "react";
import _camel from "lodash/camelCase";
import { IMenuModalProps } from ".";

import { TextField } from "@mui/material";

import Modal from "components/Modal";
import { FieldType } from "constants/fields";
import FieldsDropdown from "./FieldsDropdown";
import { getFieldProp } from "components/fields";
import { analytics } from "analytics";

export interface INewColumnProps extends IMenuModalProps {
  data: Record<string, any>;
  openSettings: (column: any) => void;
}

export default function NewColumn({
  open,
  data,
  openSettings,
  handleClose,
  handleSave,
}: INewColumnProps) {
  const [columnLabel, setColumnLabel] = useState("");
  const [fieldKey, setFieldKey] = useState("");
  const [type, setType] = useState(FieldType.shortText);
  const requireConfiguration = getFieldProp("requireConfiguration", type);

  useEffect(() => {
    if (type !== FieldType.id) setFieldKey(_camel(columnLabel));
  }, [columnLabel]);

  useEffect(() => {
    if (type === FieldType.id) {
      setColumnLabel("ID");
      setFieldKey("id");
    }
  }, [type]);

  if (!open) return null;

  return (
    <Modal
      onClose={handleClose}
      title="Add New Column"
      fullWidth
      maxWidth="xs"
      children={
        <>
          <section>
            <TextField
              value={columnLabel}
              autoFocus
              variant="filled"
              id="columnName"
              label="Column Name"
              type="text"
              fullWidth
              onChange={(e) => setColumnLabel(e.target.value)}
              helperText="Set the user-facing name for this column."
            />
          </section>

          <section>
            <TextField
              value={fieldKey}
              variant="filled"
              id="fieldKey"
              label="Field Key"
              type="text"
              fullWidth
              onChange={(e) => setFieldKey(e.target.value)}
              disabled={type === FieldType.id && fieldKey === "id"}
              helperText="Set the Firestore field key to link to this column. It will display any existing data for this field key."
            />
          </section>

          <section>
            <FieldsDropdown value={type} onChange={setType} />
          </section>
        </>
      }
      actions={{
        primary: {
          onClick: () => {
            handleSave(fieldKey, {
              type,
              name: columnLabel,
              fieldName: fieldKey,
              key: fieldKey,
              config: {},
              ...data.initializeColumn,
            });
            if (requireConfiguration) {
              openSettings({
                type,
                name: columnLabel,
                fieldName: fieldKey,
                key: fieldKey,
                config: {},
                ...data.initializeColumn,
              });
            } else handleClose();
            analytics.logEvent("create_column", {
              type,
            });
          },
          disabled: !columnLabel || !fieldKey || !type,
          children: requireConfiguration ? "Next" : "Add",
        },
        secondary: {
          onClick: handleClose,
          children: "Cancel",
        },
      }}
    />
  );
}
