import { useRef, useState } from "react";
import {
  Button,
  ButtonGroup,
  ListItemText,
  MenuItem,
  Select,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import { ChevronDown as ArrowDropDownIcon } from "@src/assets/icons";
import { FieldType } from "@src/components/fields/types";
import { getFieldProp } from "@src/components/fields";

import {
  ArraySupportedFields,
  ArraySupportedFiledTypes,
} from "./SupportedTypes";

function AddButton({ handleAddNew }: { handleAddNew: Function }) {
  const anchorEl = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [fieldType, setFieldType] = useState<ArraySupportedFiledTypes>(
    FieldType.shortText
  );

  return (
    <>
      <ButtonGroup
        variant="contained"
        color="primary"
        aria-label="Split button"
        sx={{ width: "fit-content" }}
        ref={anchorEl}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleAddNew(fieldType)}
          startIcon={<AddIcon />}
        >
          Add {getFieldProp("name", fieldType)}
        </Button>

        <Button
          variant="contained"
          color="primary"
          aria-label="Select add element"
          aria-haspopup="menu"
          style={{ padding: 0 }}
          onClick={() => setOpen(true)}
          id="add-row-menu-button"
          aria-controls={open ? "add-new-element" : undefined}
          aria-expanded={open ? "true" : "false"}
        >
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>

      <Select
        id="add-new-element"
        open={open}
        onClose={() => setOpen(false)}
        label="Add new element"
        style={{ display: "none" }}
        value={fieldType}
        onChange={(e) => setFieldType(e.target.value as typeof fieldType)}
        MenuProps={{
          anchorEl: anchorEl.current,
          MenuListProps: { "aria-labelledby": "add-row-menu-button" },
          anchorOrigin: { horizontal: "left", vertical: "bottom" },
          transformOrigin: { horizontal: "left", vertical: "top" },
        }}
      >
        {ArraySupportedFields.map((fieldType, i) => (
          <MenuItem value={fieldType} disabled={false} key={i + ""}>
            <ListItemText
              primary={getFieldProp("name", fieldType)}
              secondary={getFieldProp("description", fieldType)}
              secondaryTypographyProps={{
                variant: "caption",
                whiteSpace: "pre-line",
              }}
            />
          </MenuItem>
        ))}
      </Select>
    </>
  );
}

export default AddButton;
