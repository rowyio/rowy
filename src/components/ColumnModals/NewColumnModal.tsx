import { useState } from "react";
import { useAtom, useSetAtom } from "jotai";
import { camelCase } from "lodash-es";
import { IColumnModalProps } from ".";

import { TextField, Typography, Button } from "@mui/material";

import Modal from "@src/components/Modal";
import FieldsDropdown from "./FieldsDropdown";

import { projectScope, updateTableAtom } from "@src/atoms/projectScope";
import {
  tableScope,
  tableSettingsAtom,
  addColumnAtom,
  columnModalAtom,
} from "@src/atoms/tableScope";
import { FieldType } from "@src/constants/fields";
import { getFieldProp } from "@src/components/fields";
import { analytics, logEvent } from "@src/analytics";

const AUDIT_FIELD_TYPES = [
  FieldType.createdBy,
  FieldType.createdAt,
  FieldType.updatedBy,
  FieldType.updatedAt,
];

export default function NewColumnModal({
  onClose,
}: Pick<IColumnModalProps, "onClose">) {
  const [updateTable] = useAtom(updateTableAtom, projectScope);
  const [tableSettings] = useAtom(tableSettingsAtom, tableScope);
  const addColumn = useSetAtom(addColumnAtom, tableScope);
  const [columnModal, setColumnModal] = useAtom(columnModalAtom, tableScope);

  const [columnLabel, setColumnLabel] = useState("");
  const [fieldKey, setFieldKey] = useState("");
  const [type, setType] = useState("" as any);
  const requireConfiguration = getFieldProp("requireConfiguration", type);

  const isAuditField = AUDIT_FIELD_TYPES.includes(type);

  const handleTypeChange = (type: FieldType) => {
    setType(type);
    switch (type) {
      case FieldType.id:
        setColumnLabel("ID");
        setFieldKey("id");
        break;
      case FieldType.createdBy:
        setColumnLabel("Created By");
        setFieldKey(tableSettings.auditFieldCreatedBy || "_createdBy");
        break;
      case FieldType.updatedBy:
        setColumnLabel("Updated By");
        setFieldKey(tableSettings.auditFieldUpdatedBy || "_updatedBy");
        break;
      case FieldType.createdAt:
        setColumnLabel("Created At");
        setFieldKey(
          (tableSettings.auditFieldCreatedBy || "_createdBy") + ".timestamp"
        );
        break;
      case FieldType.updatedAt:
        setColumnLabel("Updated At");
        setFieldKey(
          (tableSettings.auditFieldUpdatedBy || "_updatedBy") + ".timestamp"
        );
        break;
    }
  };

  return (
    <Modal
      onClose={onClose}
      title="Add new column"
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
              label="Column name"
              type="text"
              fullWidth
              onChange={(e) => {
                setColumnLabel(e.target.value);
                if (type !== FieldType.id && !isAuditField) {
                  setFieldKey(camelCase(e.target.value));
                }
              }}
              helperText="Set the user-facing name for this column."
            />
          </section>

          <section>
            <TextField
              value={fieldKey}
              variant="filled"
              id="fieldKey"
              label="Field key"
              type="text"
              fullWidth
              onChange={(e) => setFieldKey(e.target.value)}
              disabled={
                (type === FieldType.id && fieldKey === "id") || isAuditField
              }
              helperText="Set the Firestore field key to link to this column. It will display any existing data for this field key."
              sx={{ "& .MuiInputBase-input": { fontFamily: "mono" } }}
            />
          </section>

          <section>
            <FieldsDropdown value={type} onChange={handleTypeChange} />
          </section>

          {isAuditField && tableSettings.audit === false && (
            <section>
              <Typography gutterBottom>
                This field requires auditing to be enabled on this table.
              </Typography>

              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  if (updateTable)
                    updateTable({
                      id: tableSettings.id,
                      tableType: tableSettings.tableType,
                      audit: true,
                    });
                }}
              >
                Enable auditing on this table
              </Button>
            </section>
          )}
        </>
      }
      actions={{
        primary: {
          onClick: () => {
            addColumn({
              config: {
                type,
                name: columnLabel,
                fieldName: fieldKey,
                key: fieldKey,
                config: {},
              },
              index: columnModal!.index,
            });
            if (requireConfiguration) {
              setColumnModal({ type: "config", columnKey: fieldKey });
            } else {
              onClose();
            }
            logEvent(analytics, "create_column", { type });
          },
          disabled:
            !columnLabel ||
            !fieldKey ||
            !type ||
            (isAuditField && tableSettings.audit === false),
          children: requireConfiguration ? "Next" : "Add",
        },
        secondary: {
          onClick: onClose,
          children: "Cancel",
        },
      }}
    />
  );
}
