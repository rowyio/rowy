import { useState, useRef } from "react";
import { format, formatRelative } from "date-fns";

import {
  Stack,
  ButtonBase,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Switch,
  Tooltip,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ExtensionIcon from "assets/icons/Extension";
import DuplicateIcon from "@mui/icons-material/ContentCopy";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteForever";

import EmptyState from "components/EmptyState";
import { extensionTypes, IExtension, IExtensionType } from "./utils";

export interface IExtensionListProps {
  extensions: IExtension[];
  handleAddExtension: (type: IExtensionType) => void;
  handleUpdateActive: (index: number, active: boolean) => void;
  handleDuplicate: (index: number) => void;
  handleEdit: (index: number) => void;
  handleDelete: (index: number) => void;
}

export default function ExtensionList({
  extensions,
  handleAddExtension,
  handleUpdateActive,
  handleDuplicate,
  handleEdit,
  handleDelete,
}: IExtensionListProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const addButtonRef = useRef(null);

  const activeExtensionCount = extensions.filter(
    (extension) => extension.active
  ).length;

  const handleAddButton = () => {
    setAnchorEl(addButtonRef.current);
  };

  const handleChooseAddType = (type: IExtensionType) => {
    handleClose();
    handleAddExtension(type);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Stack
        direction="row"
        spacing={2}
        justifyContent="space-between"
        alignItems="center"
        style={{ marginTop: 0 }}
      >
        <Typography
          variant="subtitle2"
          component="h2"
          style={{ fontFeatureSettings: "'case', 'tnum'" }}
        >
          Extensions ({activeExtensionCount} / {extensions.length})
        </Typography>

        <Button
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddButton}
          ref={addButtonRef}
        >
          Add Extension…
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          {extensionTypes.map((type) => (
            <MenuItem
              onClick={() => {
                handleChooseAddType(type);
              }}
            >
              {type}
            </MenuItem>
          ))}
        </Menu>
      </Stack>

      {extensions.length === 0 ? (
        <ButtonBase
          onClick={handleAddButton}
          sx={{
            width: "100%",
            height: 72 * 3,
            borderRadius: 1,
            "&:hover": { bgcolor: "action.hover" },
          }}
        >
          <EmptyState
            message="Add Your First Extension"
            description="Your extensions will appear here."
            Icon={ExtensionIcon}
          />
        </ButtonBase>
      ) : (
        <List style={{ paddingTop: 0, minHeight: 72 * 3 }}>
          {extensions.map((extensionObject, index) => (
            <ListItem
              disableGutters
              dense={false}
              divider={index !== extensions.length - 1}
              children={
                <ListItemText
                  primary={extensionObject.name}
                  secondary={extensionObject.type}
                />
              }
              secondaryAction={
                <Stack alignItems="flex-end">
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Tooltip
                      title={extensionObject.active ? "Deactivate" : "Activate"}
                    >
                      <Switch
                        checked={extensionObject.active}
                        onClick={() =>
                          handleUpdateActive(index, !extensionObject.active)
                        }
                        inputProps={{ "aria-label": "Activate" }}
                        sx={{ mr: 1 }}
                      />
                    </Tooltip>

                    <Tooltip title="Duplicate">
                      <IconButton
                        aria-label="Duplicate"
                        onClick={() => handleDuplicate(index)}
                      >
                        <DuplicateIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton
                        aria-label="Edit"
                        onClick={() => handleEdit(index)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        aria-label="Delete"
                        color="error"
                        onClick={() => handleDelete(index)}
                        sx={{ "&&": { mr: -1.5 } }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Stack>

                  <Tooltip
                    title={
                      <>
                        Last updated by {extensionObject.lastEditor.displayName}
                        <br />
                        on{" "}
                        {format(extensionObject.lastEditor.lastUpdate, "PPPP")}
                        <br />
                        at{" "}
                        {format(extensionObject.lastEditor.lastUpdate, "pppp")}
                      </>
                    }
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography
                        variant="body2"
                        sx={{ color: "text.disabled" }}
                      >
                        {formatRelative(
                          extensionObject.lastEditor.lastUpdate,
                          new Date()
                        )}
                      </Typography>
                      <Avatar
                        alt={`${extensionObject.lastEditor.displayName}’s profile photo`}
                        src={extensionObject.lastEditor.photoURL}
                        sx={{ width: 24, height: 24, "&&": { mr: -0.5 } }}
                      />
                    </Stack>
                  </Tooltip>
                </Stack>
              }
            />
          ))}
        </List>
      )}
    </>
  );
}
