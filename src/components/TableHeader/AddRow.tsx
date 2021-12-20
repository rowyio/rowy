import { useState, useRef } from "react";
import createPersistedState from "use-persisted-state";
import { FieldType, FormDialog } from "@rowy/form-builder";

import {
  Button,
  ButtonGroup,
  Select,
  MenuItem,
  ListItemText,
  Box,
} from "@mui/material";
import AddRowIcon from "@src/assets/icons/AddRow";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import { useAppContext } from "@src/contexts/AppContext";
import { useProjectContext } from "@src/contexts/ProjectContext";
import { isCollectionGroup } from "@src/utils/fns";
import { db } from "@src/firebase";

const useIdTypeState = createPersistedState("__ROWY__ADD_ROW_ID_TYPE");

export default function AddRow() {
  const { userClaims } = useAppContext();
  const { addRow, table, tableState } = useProjectContext();

  const anchorEl = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [idType, setIdType] = useIdTypeState<"smaller" | "random" | "custom">(
    "smaller"
  );
  const [openIdModal, setOpenIdModal] = useState(false);

  const handleClick = () => {
    if (idType === "smaller") {
      addRow!(undefined, undefined, { type: "smaller" });
    } else if (idType === "random") {
      addRow!();
    } else if (idType === "custom") {
      setOpenIdModal(true);
    }
  };

  if (table?.readOnly && !userClaims?.roles.includes("ADMIN"))
    return <Box sx={{ mr: -2 }} />;

  return (
    <>
      <ButtonGroup
        variant="contained"
        color="primary"
        aria-label="Split button"
        ref={anchorEl}
        disabled={isCollectionGroup() || !addRow}
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
        <MenuItem value="smaller">
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
              validation: [
                [
                  "test",
                  "existing-id",
                  "A row with this ID already exists",
                  async (value) =>
                    value &&
                    (
                      await db
                        .collection(tableState!.tablePath!)
                        .doc(value)
                        .get()
                    ).exists === false,
                ],
              ],
            },
          ]}
          onSubmit={(v) => addRow!(undefined, undefined, v.id)}
          onClose={() => setOpenIdModal(false)}
          DialogProps={{ maxWidth: "xs" }}
          SubmitButtonProps={{ children: "Add row" }}
        />
      )}
    </>
  );
}
