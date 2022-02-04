import { useState, useEffect } from "react";
import _camel from "lodash/camelCase";
import { IMenuModalProps } from ".";

import { TextField, Typography, Button } from "@mui/material";

import Modal from "@src/components/Modal";
import FieldsDropdown from "./FieldsDropdown";

import { FieldType } from "@src/constants/fields";
import { getFieldProp } from "@src/components/fields";
import { analytics } from "analytics";
import { useProjectContext } from "@src/contexts/ProjectContext";

const AUDIT_FIELD_TYPES = [
  FieldType.createdBy,
  FieldType.createdAt,
  FieldType.updatedBy,
  FieldType.updatedAt,
];
export interface INewColumnProps extends IMenuModalProps {
  data: Record<string, any>;
  openSettings: (column: any) => void;
}
export default function NewColumn({
  open,
  data,
  openSettings,
  handleClose,
}: INewColumnProps) {
  const { settingsActions, table, tableActions } = useProjectContext();
  const [columnLabel, setColumnLabel] = useState("");
  const [fieldKey, setFieldKey] = useState("");
  const [type, setType] = useState(FieldType.shortText);
  const requireConfiguration = getFieldProp("requireConfiguration", type);

  const isAuditField = AUDIT_FIELD_TYPES.includes(type);

  useEffect(() => {
    switch (type) {
      case FieldType.id:
        setColumnLabel("ID");
        setFieldKey("id");
        break;
      case FieldType.createdBy:
        setColumnLabel("Created By");
        setFieldKey(table?.auditFieldCreatedBy || "_createdBy");
        break;
      case FieldType.updatedBy:
        setColumnLabel("Updated By");
        setFieldKey(table?.auditFieldUpdatedBy || "_updatedBy");
        break;
      case FieldType.createdAt:
        setColumnLabel("Created At");
        setFieldKey(
          (table?.auditFieldCreatedBy || "_createdBy") + ".timestamp"
        );
        break;
      case FieldType.updatedAt:
        setColumnLabel("Updated At");
        setFieldKey(
          (table?.auditFieldUpdatedBy || "_updatedBy") + ".timestamp"
        );
        break;
    }
  }, [type, table?.auditFieldCreatedBy, table?.auditFieldUpdatedBy]);

  if (!open) return null;

  return (
    <Modal
      onClose={handleClose}
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
                  setFieldKey(_camel(e.target.value));
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
            <FieldsDropdown value={type} onChange={setType} />
          </section>

          {isAuditField && table?.audit === false && (
            <section>
              <Typography gutterBottom>
                This field requires auditing to be enabled on this table.
              </Typography>

              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  settingsActions?.updateTable({ id: table.id, audit: true });
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
            tableActions?.column.insert(
              {
                type,
                name: columnLabel,
                fieldName: fieldKey,
                key: fieldKey,
                config: {},
              },
              {
                insert: data.insert,
                index: data.sourceIndex,
              }
            );
            if (requireConfiguration) {
              openSettings({
                type,
                name: columnLabel,
                fieldName: fieldKey,
                key: fieldKey,
                config: {},
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
