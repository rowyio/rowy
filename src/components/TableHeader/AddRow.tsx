import { useState } from "react";
import { Menu, MenuItem, TextField } from "@mui/material";
import AddRowIcon from "@src/assets/icons/AddRow";

import { useProjectContext } from "@src/contexts/ProjectContext";
import { Button, ButtonGroup } from "@mui/material";
import { isCollectionGroup } from "@src/utils/fns";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import AddIcon from "@mui/icons-material/Add";
export default function AddRow() {
  const { addRow } = useProjectContext();
  const [addRowMenuAnchor, setAddRowMenuAnchor] = useState<any | null>(null);
  const [customId, setCustomId] = useState("");
  const handleClose = () => {
    setAddRowMenuAnchor(null);
    setCustomId("");
  };
  return (
    <>
      <ButtonGroup
        variant="contained"
        aria-label="Split button"
        style={{ display: "flex" }}
      >
        <Button
          disabled={isCollectionGroup() || !addRow}
          onClick={() => addRow!()}
          variant="contained"
          color="primary"
          startIcon={<AddRowIcon />}
          // sx={{ pr: 1.5 }}
        >
          Add row
        </Button>

        <Button
          // aria-expanded={open ? 'true' : undefined}
          aria-label="select merge strategy"
          aria-haspopup="menu"
          style={{ padding: 0 }}
          onClick={(e) => setAddRowMenuAnchor(e.currentTarget)}
          id="add-row-menu-button"
          aria-controls="add-row-menu"
          aria-expanded={!!addRowMenuAnchor ? "true" : "false"}
        >
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
      <Menu
        id="snippet-menu"
        anchorEl={addRowMenuAnchor}
        open={!!addRowMenuAnchor}
        onClose={handleClose}
        MenuListProps={{ "aria-labelledby": "add-row-button" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
      >
        <MenuItem
          key={"custom-id"}
          children={
            <>
              <TextField
                placeholder="Custom Id"
                value={customId}
                onChange={(e) => setCustomId(e.target.value)}
              />
              <Button
                variant="outlined"
                color="secondary"
                size="small"
                style={{ minWidth: 32, height: 32, padding: 0 }}
                aria-label={"Add Custom id"}
                disabled={customId === ""}
                onClick={() => {
                  addRow!({}, false, customId);
                  handleClose();
                }}
              >
                {<AddIcon />}
              </Button>
            </>
          }
        />
      </Menu>
    </>
  );
}
