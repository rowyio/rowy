import { IEditorCellProps } from "@src/components/fields/types";
import { useSetAtom } from "jotai";

import { format } from "date-fns";

import { alpha, Stack, Grid, Tooltip, Chip, IconButton } from "@mui/material";
import { Upload as UploadIcon } from "@src/assets/icons";
import ChipList from "@src/components/Table/TableCell/ChipList";
import CircularProgressOptical from "@src/components/CircularProgressOptical";

import { projectScope, confirmDialogAtom } from "@src/atoms/projectScope";
import { FileIcon } from ".";
import { DATE_TIME_FORMAT } from "@src/constants/dates";
import { FileValue } from "@src/types/table";
import useFileUpload from "./useFileUpload";

import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  ResponderProvided,
} from "react-beautiful-dnd";

export default function File_({
  column,
  value,
  disabled,
  _rowy_ref,
  tabIndex,
  rowHeight,
}: IEditorCellProps) {
  const confirm = useSetAtom(confirmDialogAtom, projectScope);

  const {
    loading,
    progress,
    handleDelete,
    localFiles,
    dropzoneState,
    handleUpdate,
  } = useFileUpload(_rowy_ref, column.key, { multiple: true });

  const { isDragActive, getRootProps, getInputProps } = dropzoneState;
  const dropzoneProps = getRootProps();

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
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        width: "100%",
        height: "100%",
        py: 0,
        pl: 1,

        ...(isDragActive
          ? {
              backgroundColor: (theme) =>
                alpha(
                  theme.palette.primary.main,
                  theme.palette.action.hoverOpacity * 2
                ),

              "& .row-hover-iconButton": { color: "primary.main" },
            }
          : {}),
      }}
      {...dropzoneProps}
      tabIndex={tabIndex}
      onClick={undefined}
    >
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="image-droppable" direction="horizontal">
          {(provided) => (
            <ChipList rowHeight={rowHeight}>
              <Grid
                container
                spacing={0.5}
                wrap="nowrap"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {Array.isArray(value) &&
                  value.map((file: FileValue, i) => (
                    <Draggable
                      key={file.downloadURL}
                      draggableId={file.downloadURL}
                      index={i}
                    >
                      {(provided) => (
                        <Grid
                          item
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            // Truncate so multiple files still visible
                            maxWidth: `${
                              value.length > 1 ? "calc(100% - 12px)" : "initial"
                            }`,
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
                          <Tooltip
                            title={`File last modified ${format(
                              file.lastModifiedTS,
                              DATE_TIME_FORMAT
                            )}`}
                          >
                            <Chip
                              label={file.name}
                              icon={<FileIcon />}
                              sx={{
                                "& .MuiChip-label": {
                                  lineHeight: 5 / 3,
                                },
                              }}
                              onClick={(e: any) => e.stopPropagation()}
                              component="a"
                              href={file.downloadURL}
                              target="_blank"
                              rel="noopener noreferrer"
                              clickable
                              onDelete={
                                disabled
                                  ? undefined
                                  : (e) => {
                                      e.preventDefault();
                                      confirm({
                                        handleConfirm: () => handleDelete(file),
                                        title: "Delete file?",
                                        body: "This file cannot be recovered after",
                                        confirm: "Delete",
                                        confirmColor: "error",
                                      });
                                    }
                              }
                              tabIndex={tabIndex}
                              style={{ width: "100%", cursor: "pointer" }}
                            />
                          </Tooltip>
                        </Grid>
                      )}
                    </Draggable>
                  ))}
              </Grid>

              {localFiles &&
                localFiles.map((file) => (
                  <Grid item key={file.name}>
                    <Chip
                      icon={<FileIcon />}
                      label={file.name}
                      deleteIcon={
                        <CircularProgressOptical size={20} color="inherit" />
                      }
                    />
                  </Grid>
                ))}
            </ChipList>
          )}
        </Droppable>
      </DragDropContext>

      {!loading ? (
        !disabled && (
          <IconButton
            size="small"
            onClick={(e) => {
              dropzoneProps.onClick!(e);
              e.stopPropagation();
            }}
            style={{ display: "flex" }}
            className={_rowy_ref && "row-hover-iconButton end"}
            disabled={!_rowy_ref}
            tabIndex={tabIndex}
          >
            <UploadIcon />
          </IconButton>
        )
      ) : (
        <div style={{ padding: 4 }}>
          <CircularProgressOptical
            size={24}
            variant={progress === 0 ? "indeterminate" : "determinate"}
            value={progress}
            style={{ display: "block" }}
          />
        </div>
      )}

      <input {...getInputProps()} tabIndex={tabIndex} />
    </Stack>
  );
}
