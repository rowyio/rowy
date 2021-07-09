import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  makeStyles,
  Menu,
  MenuItem,
  Switch,
  Tooltip,
  Typography,
} from "@material-ui/core";
import React, { useState } from "react";
import moment from "moment";
import { extensionTypes, IExtension, IExtensionType } from "./utils";
import EmptyState from "components/EmptyState";
import AddIcon from "@material-ui/icons/Add";
import EmptyIcon from "@material-ui/icons/AddBox";
import DuplicateIcon from "@material-ui/icons/FileCopy";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/DeleteForever";
import { useRef } from "react";

const useStyles = makeStyles((theme) => ({
  hoverableEmptyState: {
    borderRadius: theme.spacing(1),
    cursor: "pointer",
    padding: theme.spacing(2),
    "&:hover": {
      background: theme.palette.background.paper,
    },
  },
  divider: {
    margin: theme.spacing(1, 0),
  },
  extensionName: {
    marginTop: theme.spacing(1),
  },
  extensionType: {
    marginBottom: theme.spacing(1),
  },
  avatar: {
    marginRight: theme.spacing(1),
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
  extensionList: {
    height: "50vh",
    overflowY: "scroll",
  },
}));

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
  const classes = useStyles();

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
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        marginTop={"0px !important"}
      >
        <Typography variant="overline">
          EXTENSION ({activeExtensionCount}/{extensions.length})
        </Typography>
        <Button
          startIcon={<AddIcon />}
          onClick={handleAddButton}
          ref={addButtonRef}
        >
          ADD EXTENTION
        </Button>
        <Menu
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
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
      </Box>

      <Box className={classes.extensionList}>
        {extensions.length === 0 && (
          <EmptyState
            message="Add your first extension"
            description={
              "When you add extentions, your extentions should be shown here."
            }
            Icon={EmptyIcon}
            className={classes.hoverableEmptyState}
            onClick={handleAddButton}
          />
        )}
        {extensions.map((extensionObject, index) => {
          return (
            <>
              <Box
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
              >
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="space-between"
                >
                  <Typography variant="body2" className={classes.extensionName}>
                    {extensionObject.name}
                  </Typography>
                  <Typography
                    variant="overline"
                    className={classes.extensionType}
                  >
                    {extensionObject.type}
                  </Typography>
                </Box>
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="space-between"
                  alignItems="flex-end"
                >
                  <Box display="flex" alignItems="center">
                    <Tooltip
                      title={extensionObject.active ? "Deactivate" : "Activate"}
                    >
                      <Switch
                        color="primary"
                        checked={extensionObject.active}
                        onClick={() => {
                          handleUpdateActive(index, !extensionObject.active);
                        }}
                      />
                    </Tooltip>
                    <Tooltip title={"Edit"}>
                      <IconButton
                        color="secondary"
                        onClick={() => {
                          handleEdit(index);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={"Duplicate"}>
                      <IconButton
                        color="secondary"
                        onClick={() => {
                          handleDuplicate(index);
                        }}
                      >
                        <DuplicateIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={"Delete"}>
                      <IconButton
                        color="primary"
                        onClick={() => {
                          handleDelete(index);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Tooltip
                    title={`Last updated by ${
                      extensionObject.lastEditor.displayName
                    } on ${moment(extensionObject.lastEditor.lastUpdate).format(
                      "LLLL"
                    )}`}
                  >
                    <Box display="flex" alignItems="center">
                      <Avatar
                        alt="profile"
                        src={extensionObject.lastEditor.photoURL}
                        className={classes.avatar}
                      />
                      <Typography variant="caption" color="textSecondary">
                        {moment(
                          extensionObject.lastEditor.lastUpdate
                        ).calendar()}
                      </Typography>
                    </Box>
                  </Tooltip>
                </Box>
              </Box>
              {index + 1 !== extensions.length && (
                <Divider light className={classes.divider} />
              )}
            </>
          );
        })}
      </Box>
    </>
  );
}
