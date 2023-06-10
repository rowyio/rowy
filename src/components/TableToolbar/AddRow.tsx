import { useState, useRef } from "react";
import { useAtom, useSetAtom } from "jotai";
import { FieldType, FormDialog } from "@rowy/form-builder";

import {
  Button,
  ButtonGroup,
  Select,
  MenuItem,
  ListItemText,
  Box,
  Tooltip,
} from "@mui/material";
import {
  AddRow as AddRowIcon,
  AddRowTop as AddRowTopIcon,
  ChevronDown as ArrowDropDownIcon,
} from "@src/assets/icons";

import { projectScope, userRolesAtom } from "@src/atoms/projectScope";
import {
  tableScope,
  tableSettingsAtom,
  tableFiltersAtom,
  tableSortsAtom,
  addRowAtom,
  _updateRowDbAtom,
  tableColumnsOrderedAtom,
  tableSchemaAtom,
  updateTableSchemaAtom,
} from "@src/atoms/tableScope";
import { TableIdType } from "@src/types/table";

export default function AddRow() {
  const [userRoles] = useAtom(userRolesAtom, projectScope);
  const [tableSettings] = useAtom(tableSettingsAtom, tableScope);
  const [tableSchema] = useAtom(tableSchemaAtom, tableScope);
  const [tableFilters] = useAtom(tableFiltersAtom, tableScope);
  const [tableSorts] = useAtom(tableSortsAtom, tableScope);
  const [updateTableSchema] = useAtom(updateTableSchemaAtom, tableScope);
  const addRow = useSetAtom(addRowAtom, tableScope);
  const anchorEl = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [openIdModal, setOpenIdModal] = useState(false);

  const idType = tableSchema.idType || "decrement";
  const forceRandomId = tableFilters.length > 0 || tableSorts.length > 0;

  const handleSetIdType = async (idType: TableIdType) => {
    // TODO(han): refactor atom - error handler
    await updateTableSchema!({
      idType,
    });
  };

  const handleClick = () => {
    if (idType === "random" || (forceRandomId && idType === "decrement")) {
      addRow({
        row: {
          _rowy_ref: {
            id: "random",
            path: tableSettings.collection + "/random",
          },
        },
        setId: "random",
      });
    } else if (idType === "decrement") {
      addRow({
        row: {
          _rowy_ref: {
            id: "decrement",
            path: tableSettings.collection + "/decrement",
          },
        },
        setId: "decrement",
      });
    } else if (idType === "custom") {
      setOpenIdModal(true);
    }
  };

  if (tableSettings.readOnly && !userRoles.includes("ADMIN"))
    return <Box sx={{ mr: -2 }} />;

  return (
    <>
      <Tooltip
        title={
          tableSettings.tableType === "collectionGroup"
            ? "Add row is not supported for collection group."
            : null
        }
        arrow
      >
        <ButtonGroup
          variant="contained"
          color="primary"
          aria-label="Split button"
          ref={anchorEl}
          disabled={tableSettings.tableType === "collectionGroup" || !addRow}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={handleClick}
            startIcon={
              idType === "decrement" && !forceRandomId ? (
                <AddRowTopIcon />
              ) : (
                <AddRowIcon />
              )
            }
          >
            Add row{idType === "custom" ? "…" : ""}
          </Button>

          <Button
            variant="contained"
            color="primary"
            aria-label="Select row add position"
            aria-haspopup="menu"
            style={{ padding: 0 }}
            onClick={() => setOpen(true)}
            id="add-row-menu-button"
            aria-controls={open ? "add-row-menu" : undefined}
            aria-expanded={open ? "true" : "false"}
          >
            <ArrowDropDownIcon />
          </Button>
        </ButtonGroup>
      </Tooltip>

      <Select
        id="add-row-menu"
        open={open}
        onClose={() => setOpen(false)}
        label="Row add position"
        style={{ display: "none" }}
        value={forceRandomId && idType === "decrement" ? "random" : idType}
        onChange={(e) => handleSetIdType(e.target.value as typeof idType)}
        MenuProps={{
          anchorEl: anchorEl.current,
          MenuListProps: { "aria-labelledby": "add-row-menu-button" },
          anchorOrigin: { horizontal: "left", vertical: "bottom" },
          transformOrigin: { horizontal: "left", vertical: "top" },
        }}
      >
        <MenuItem value="decrement" disabled={forceRandomId}>
          <ListItemText
            primary="To top"
            secondary="Generates a smaller ID so the new row will appear on the top"
            secondaryTypographyProps={{ variant: "caption" }}
          />
        </MenuItem>
        <MenuItem value="random">
          <ListItemText
            primary="With random ID"
            secondary={
              "Temporarily displays the new row on the top for editing,\nbut will appear in a different position afterwards"
            }
            secondaryTypographyProps={{
              variant: "caption",
              whiteSpace: "pre-line",
            }}
          />
        </MenuItem>
        <MenuItem value="custom">
          <ListItemText
            primary="With custom ID…"
            secondary={
              "Temporarily displays the new row on the top for editing,\nbut will appear in a different position afterwards"
            }
            secondaryTypographyProps={{
              variant: "caption",
              whiteSpace: "pre-line",
            }}
          />
        </MenuItem>
      </Select>

      {openIdModal && (
        <FormDialog
          title="Add row with custom ID"
          fields={[
            {
              type: FieldType.shortText,
              name: "id",
              label: "Custom ID",
              required: true,
              autoFocus: true,
              // Disable validation to make it compatible with non-Firestore
              // databases. If a user adds a row with an existing ID, it will
              // update that document.
              // validation: [
              //   [
              //     "test",
              //     "existing-id",
              //     "A row with this ID already exists",
              //     async (value) =>
              //       value &&
              //       (
              //         await db
              //           .collection(tableState!.tablePath!)
              //           .doc(value)
              //           .get()
              //       ).exists === false,
              //   ],
              // ],
            },
          ]}
          onSubmit={(v) =>
            addRow({
              row: {
                _rowy_ref: {
                  id: v.id,
                  path: tableSettings.collection + "/" + v.id,
                },
              },
            })
          }
          onClose={() => setOpenIdModal(false)}
          DialogProps={{ maxWidth: "xs" }}
          SubmitButtonProps={{ children: "Add row" }}
        />
      )}
    </>
  );
}

export function AddRowArraySubTable() {
  const [updateRowDb] = useAtom(_updateRowDbAtom, tableScope);
  const [open, setOpen] = useState(false);

  const anchorEl = useRef<HTMLDivElement>(null);
  const [addRowAt, setAddNewRowAt] = useState<"top" | "bottom">("bottom");
  const [tableColumnsOrdered] = useAtom(tableColumnsOrderedAtom, tableScope);

  if (!updateRowDb) return null;

  const handleClick = () => {
    const initialValues: Record<string, any> = {};

    // Set initial values based on default values
    for (const column of tableColumnsOrdered) {
      if (column.config?.defaultValue?.type === "static")
        initialValues[column.key] = column.config.defaultValue.value!;
      else if (column.config?.defaultValue?.type === "null")
        initialValues[column.key] = null;
    }

    updateRowDb("", initialValues, undefined, {
      index: 0,
      operation: {
        addRow: addRowAt,
      },
    });
  };
  return (
    <>
      <ButtonGroup
        variant="contained"
        color="primary"
        aria-label="Split button"
        ref={anchorEl}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleClick}
          startIcon={addRowAt === "top" ? <AddRowTopIcon /> : <AddRowIcon />}
        >
          Add row to {addRowAt}
        </Button>

        <Button
          variant="contained"
          color="primary"
          aria-label="Select row add position"
          aria-haspopup="menu"
          style={{ padding: 0 }}
          onClick={() => setOpen(true)}
          id="add-row-menu-button"
          aria-controls={open ? "add-row-menu" : undefined}
          aria-expanded={open ? "true" : "false"}
        >
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>

      <Select
        id="add-row-menu"
        open={open}
        onClose={() => setOpen(false)}
        label="Row add position"
        style={{ display: "none" }}
        value={addRowAt}
        onChange={(e) => setAddNewRowAt(e.target.value as typeof addRowAt)}
        MenuProps={{
          anchorEl: anchorEl.current,
          MenuListProps: { "aria-labelledby": "add-row-menu-button" },
          anchorOrigin: { horizontal: "left", vertical: "bottom" },
          transformOrigin: { horizontal: "left", vertical: "top" },
        }}
      >
        <MenuItem value="top">
          <ListItemText
            primary="To top"
            secondary="Adds a new row to the top of this table"
            secondaryTypographyProps={{ variant: "caption" }}
          />
        </MenuItem>
        <MenuItem value="bottom">
          <ListItemText
            primary="To bottom"
            secondary={"Adds a new row to the bottom of this table"}
            secondaryTypographyProps={{
              variant: "caption",
              whiteSpace: "pre-line",
            }}
          />
        </MenuItem>
      </Select>
    </>
  );
}
