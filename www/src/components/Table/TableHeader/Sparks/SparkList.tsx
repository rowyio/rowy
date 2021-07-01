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
import { sparkTypes, ISpark, ISparkType } from "./utils";
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
  sparkName: {
    marginTop: theme.spacing(1),
  },
  sparkType: {
    marginBottom: theme.spacing(1),
  },
  avatar: {
    marginRight: theme.spacing(1),
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
}));

export interface ISparkListProps {
  sparks: ISpark[];
  handleAddSpark: (type: ISparkType) => void;
  handleUpdateActive: (index: number, active: boolean) => void;
  handleDuplicate: (index: number) => void;
  handleEdit: (index: number) => void;
  handleDelete: (index: number) => void;
}

export default function SparkList({
  sparks,
  handleAddSpark,
  handleUpdateActive,
  handleDuplicate,
  handleEdit,
  handleDelete,
}: ISparkListProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const addButtonRef = useRef(null);
  const classes = useStyles();

  const activeSparkCount = sparks.filter((spark) => spark.active).length;

  const handleAddButton = () => {
    setAnchorEl(addButtonRef.current);
  };

  const handleChooseAddType = (type: ISparkType) => {
    handleClose();
    handleAddSpark(type);
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
          SPARKS ({activeSparkCount}/{sparks.length})
        </Typography>
        <Button
          startIcon={<AddIcon />}
          onClick={handleAddButton}
          ref={addButtonRef}
        >
          ADD SPARK
        </Button>
        <Menu
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          {sparkTypes.map((type) => (
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

      {sparks.length === 0 && (
        <EmptyState
          message="Add your first spark"
          description={"When you add sparks, your sparks should be shown here."}
          Icon={EmptyIcon}
          className={classes.hoverableEmptyState}
          onClick={handleAddButton}
        />
      )}

      <Box>
        {sparks.map((sparkObject, index) => {
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
                  <Typography variant="body2" className={classes.sparkName}>
                    {sparkObject.name.length > 0 ? sparkObject.name : "Unnamed"}
                  </Typography>
                  <Typography variant="overline" className={classes.sparkType}>
                    {sparkObject.type}
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
                      title={sparkObject.active ? "Deactivate" : "Activate"}
                    >
                      <Switch
                        color="primary"
                        checked={sparkObject.active}
                        onClick={() => {
                          handleUpdateActive(index, !sparkObject.active);
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
                      sparkObject.lastEditor.displayName
                    } on ${moment(sparkObject.lastEditor.lastUpdate).format(
                      "LLLL"
                    )}`}
                  >
                    <Box display="flex" alignItems="center">
                      <Avatar
                        alt="profile"
                        src={sparkObject.lastEditor.photoURL}
                        className={classes.avatar}
                      />
                      <Typography variant="caption" color="textSecondary">
                        {moment(sparkObject.lastEditor.lastUpdate).calendar()}
                      </Typography>
                    </Box>
                  </Tooltip>
                </Box>
              </Box>
              {index + 1 !== sparks.length && (
                <Divider light className={classes.divider} />
              )}
            </>
          );
        })}
      </Box>
    </>
  );
}
