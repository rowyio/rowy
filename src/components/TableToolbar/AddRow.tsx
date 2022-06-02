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
} from "@mui/material";
import { AddRow as AddRowIcon } from "@src/assets/icons";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import {
  globalScope,
  userRolesAtom,
  tableAddRowIdTypeAtom,
} from "@src/atoms/globalScope";
import {
  tableScope,
  tableSettingsAtom,
  addRowAtom,
} from "@src/atoms/tableScope";

export default function AddRow() {
  const [userRoles] = useAtom(userRolesAtom, globalScope);
  const [tableSettings] = useAtom(tableSettingsAtom, tableScope);
  const addRow = useSetAtom(addRowAtom, tableScope);
  const [idType, setIdType] = useAtom(tableAddRowIdTypeAtom, globalScope);

  const anchorEl = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [openIdModal, setOpenIdModal] = useState(false);

  const handleClick = () => {
    if (idType === "decrement") {
      addRow({
        row: {
          _rowy_ref: {
            id: "decrement",
            path: tableSettings.collection + "/decrement",
          },
        },
        setId: "decrement",
      });
    } else if (idType === "random") {
      addRow({
        row: {
          _rowy_ref: {
            id: "random",
            path: tableSettings.collection + "/random",
          },
        },
        setId: "random",
      });
    } else if (idType === "custom") {
      setOpenIdModal(true);
    }
  };

  if (tableSettings.readOnly && !userRoles.includes("ADMIN"))
    return <Box sx={{ mr: -2 }} />;

  return (
    <>
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
          startIcon={<AddRowIcon />}
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

      <Select
        id="add-row-menu"
        open={open}
        onClose={() => setOpen(false)}
        label="Row add position"
        style={{ display: "none" }}
        value={idType}
        onChange={(e) => setIdType(e.target.value as typeof idType)}
        MenuProps={{
          anchorEl: anchorEl.current,
          MenuListProps: { "aria-labelledby": "add-row-menu-button" },
          anchorOrigin: { horizontal: "right", vertical: "bottom" },
          transformOrigin: { horizontal: "right", vertical: "top" },
        }}
      >
        <MenuItem value="decrement">
          <ListItemText
            primary="Auto-generated ID"
            secondary="Generates a smaller ID so the new row will appear on the top"
            secondaryTypographyProps={{ variant: "caption" }}
          />
        </MenuItem>
        <MenuItem value="custom">
          <ListItemText
            primary="Custom ID"
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
