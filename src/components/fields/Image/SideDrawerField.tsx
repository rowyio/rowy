import { ISideDrawerFieldProps } from "@src/components/fields/types";
import { useMemo } from "react";
import { useSetAtom } from "jotai";
import { assignIn } from "lodash-es";

import {
  alpha,
  ButtonBase,
  Typography,
  Grid,
  Tooltip,
  Theme,
  IconButton,
  Box,
} from "@mui/material";
import AddIcon from "@mui/icons-material/AddAPhotoOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import OpenIcon from "@mui/icons-material/OpenInNewOutlined";

import { FileValue } from "@src/types/table";
import Thumbnail from "@src/components/Thumbnail";
import CircularProgressOptical from "@src/components/CircularProgressOptical";

import { projectScope, confirmDialogAtom } from "@src/atoms/projectScope";
import { fieldSx, getFieldId } from "@src/components/SideDrawer/utils";
import useFileUpload from "@src/components/fields/File/useFileUpload";
import { IMAGE_MIME_TYPES } from ".";

import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  ResponderProvided,
} from "react-beautiful-dnd";

const imgSx = {
  position: "relative",
  width: 80,
  height: 80,
  borderRadius: 1,
  // boxShadow: `0 0 0 1px ${theme.palette.divider} inset`,

  backgroundSize: "contain",
  backgroundPosition: "center center",
  backgroundRepeat: "no-repeat",
};
const thumbnailSx = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
};
const overlaySx = {
  position: "absolute",
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,

  backgroundColor: (theme: Theme) => alpha(theme.palette.background.paper, 0.8),
  color: "text.secondary",
  boxShadow: (theme: Theme) => `0 0 0 1px ${theme.palette.divider} inset`,
  borderRadius: 1,
};
const deleteImgHoverSx = {
  transition: (theme: Theme) =>
    theme.transitions.create("background-color", {
      duration: theme.transitions.duration.shortest,
    }),

  backgroundColor: "transparent",

  ".img:hover &": {
    backgroundColor: (theme: Theme) =>
      alpha(theme.palette.background.paper, 0.8),
    "& *": { opacity: 1 },
  },

  "& *": {
    opacity: 0,
    transition: (theme: Theme) =>
      theme.transitions.create("opacity", {
        duration: theme.transitions.duration.shortest,
      }),
  },
};

export default function Image_({
  column,
  _rowy_ref,
  value,
  disabled,
}: ISideDrawerFieldProps) {
  const confirm = useSetAtom(confirmDialogAtom, projectScope);

  const {
    loading,
    progress,
    handleDelete,
    uploaderState,
    localFiles,
    dropzoneState,
    handleUpdate,
  } = useFileUpload(_rowy_ref, column.key, {
    multiple: true,
    accept: IMAGE_MIME_TYPES,
  });

  const localImages = useMemo(
    () =>
      localFiles.map((file) =>
        assignIn(file, { localURL: URL.createObjectURL(file) })
      ),
    [localFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = dropzoneState;

  const onDragEnd = (result: DropResult, provided: ResponderProvided) => {
    const { destination, source } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newValue = Array.from(value);

    newValue.splice(source.index, 1);
    newValue.splice(destination.index, 0, value[source.index]);

    handleUpdate([...newValue]);
  };

  return (
    <>
      {!disabled && (
        <ButtonBase
          disabled={loading}
          sx={[
            fieldSx,
            {
              justifyContent: "flex-start",
              color: "text.secondary",
            },
            isDragActive
              ? {
                  backgroundColor: (theme) =>
                    alpha(
                      theme.palette.primary.light,
                      theme.palette.action.hoverOpacity * 2
                    ),
                  color: "primary.main",
                }
              : {},
          ]}
          {...getRootProps()}
        >
          <input id={getFieldId(column.key)} {...getInputProps()} />
          <Typography color="inherit" style={{ flexGrow: 1 }}>
            {isDragActive
              ? "Drop image here"
              : "Click to upload or drop image here"}
          </Typography>
          {loading ? (
            <CircularProgressOptical
              size={20}
              variant={progress === 0 ? "indeterminate" : "determinate"}
              value={progress}
            />
          ) : (
            <AddIcon sx={{ ml: 1, mr: 2 / 8 }} />
          )}
        </ButtonBase>
      )}

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="sidebar-image-droppable" direction="horizontal">
          {(provided) => (
            <Grid
              container
              spacing={1}
              style={{ marginTop: 0 }}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {Array.isArray(value) &&
                value.map((image: FileValue, i) => (
                  <Draggable
                    key={image.downloadURL}
                    draggableId={image.downloadURL}
                    index={i}
                  >
                    {(provided) => (
                      <Grid item>
                        {disabled ? (
                          <Tooltip title="Open">
                            <ButtonBase
                              sx={imgSx}
                              onClick={() =>
                                window.open(image.downloadURL, "_blank")
                              }
                              className="img"
                            >
                              <Thumbnail
                                imageUrl={image.downloadURL}
                                size="200x200"
                                objectFit="contain"
                                sx={thumbnailSx}
                              />
                              <Grid
                                container
                                justifyContent="center"
                                alignItems="center"
                                sx={[overlaySx, deleteImgHoverSx]}
                              >
                                {disabled ? (
                                  <OpenIcon />
                                ) : (
                                  <DeleteIcon color="error" />
                                )}
                              </Grid>
                            </ButtonBase>
                          </Tooltip>
                        ) : (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              ...provided.draggableProps.style,
                            }}
                          >
                            {value.length > 1 && (
                              <div
                                {...provided.dragHandleProps}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <DragIndicatorIcon />
                              </div>
                            )}
                            <Box sx={imgSx} className="img">
                              <Thumbnail
                                imageUrl={image.downloadURL}
                                size="200x200"
                                objectFit="contain"
                                sx={thumbnailSx}
                              />
                              <Grid
                                container
                                justifyContent="center"
                                alignItems="center"
                                sx={[overlaySx, deleteImgHoverSx]}
                              >
                                <Tooltip title="Delete…">
                                  <IconButton
                                    onClick={() =>
                                      confirm({
                                        title: "Delete image?",
                                        body: "This image cannot be recovered after",
                                        confirm: "Delete",
                                        confirmColor: "error",
                                        handleConfirm: () =>
                                          handleDelete(image),
                                      })
                                    }
                                  >
                                    <DeleteIcon color="error" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Open">
                                  <IconButton
                                    onClick={() =>
                                      window.open(image.downloadURL, "_blank")
                                    }
                                  >
                                    <OpenIcon />
                                  </IconButton>
                                </Tooltip>
                              </Grid>
                            </Box>
                          </div>
                        )}
                      </Grid>
                    )}
                  </Draggable>
                ))}
              {localImages &&
                localImages.map((image) => (
                  <Grid item key={image.name}>
                    <ButtonBase
                      sx={imgSx}
                      style={{
                        backgroundImage: `url("${image.localURL}")`,
                      }}
                      className="img"
                    >
                      {uploaderState[image.name] && (
                        <Grid
                          container
                          justifyContent="center"
                          alignItems="center"
                          sx={overlaySx}
                        >
                          <CircularProgressOptical
                            color="inherit"
                            size={48}
                            variant={
                              uploaderState[image.name].progress === 0
                                ? "indeterminate"
                                : "determinate"
                            }
                            value={uploaderState[image.name].progress}
                          />
                        </Grid>
                      )}
                    </ButtonBase>
                  </Grid>
                ))}
              {provided.placeholder}
            </Grid>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
}
