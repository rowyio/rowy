import { useCallback, useState } from "react";
import { IEditorCellProps } from "@src/components/fields/types";
import { useAtom, useSetAtom } from "jotai";

import { useDropzone } from "react-dropzone";

import { alpha, Box, Stack, Grid, IconButton, ButtonBase } from "@mui/material";
import AddIcon from "@mui/icons-material/AddAPhotoOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";

import Thumbnail from "@src/components/Thumbnail";
import CircularProgressOptical from "@src/components/CircularProgressOptical";

import { projectScope, confirmDialogAtom } from "@src/atoms/projectScope";
import {
  tableSchemaAtom,
  tableScope,
  updateFieldAtom,
} from "@src/atoms/tableScope";
import useUploader from "@src/hooks/useFirebaseStorageUploader";
import { IMAGE_MIME_TYPES } from "./index";
import { DEFAULT_ROW_HEIGHT } from "@src/components/Table";
import { FileValue } from "@src/types/table";
import { imgSx, thumbnailSx, deleteImgHoverSx } from "./DisplayCell";

export default function Image_({
  column,
  value,
  onChange,
  onSubmit,
  disabled,
  _rowy_ref,
  tabIndex,
}: IEditorCellProps) {
  const confirm = useSetAtom(confirmDialogAtom, projectScope);
  const updateField = useSetAtom(updateFieldAtom, tableScope);
  const [tableSchema] = useAtom(tableSchemaAtom, tableScope);
  const { uploaderState, upload, deleteUpload } = useUploader();
  const { progress, isLoading } = uploaderState;

  // Store a preview image locally while uploading
  const [localImage, setLocalImage] = useState<string>("");

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const imageFile = acceptedFiles[0];

      if (imageFile) {
        upload({
          docRef: _rowy_ref,
          fieldName: column.key,
          files: [imageFile],
          previousValue: value,
          onComplete: (newValue) => {
            updateField({
              path: _rowy_ref.path,
              fieldName: column.key,
              value: newValue,
            });
            setLocalImage("");
          },
        });
        setLocalImage(URL.createObjectURL(imageFile));
      }
    },
    [value]
  );

  const handleDelete = (index: number) => () => {
    const newValue = [...value];
    const toBeDeleted = newValue.splice(index, 1);
    toBeDeleted.length && deleteUpload(toBeDeleted[0]);
    onChange(newValue);
    onSubmit();
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: IMAGE_MIME_TYPES,
  });

  const dropzoneProps = getRootProps();

  const rowHeight = tableSchema.rowHeight ?? DEFAULT_ROW_HEIGHT;
  let thumbnailSize = "100x100";
  if (rowHeight > 50) thumbnailSize = "200x200";
  if (rowHeight > 100) thumbnailSize = "400x400";

  return (
    <Stack
      direction="row"
      className="cell-collapse-padding"
      sx={[
        {
          py: 0,
          pl: 1,
          height: "100%",
          width: "100%",
        },
        isDragActive
          ? {
              backgroundColor: (theme) =>
                alpha(
                  theme.palette.primary.main,
                  theme.palette.action.hoverOpacity * 2
                ),

              "& .row-hover-iconButton": { color: "primary.main" },
            }
          : {},
      ]}
      alignItems="center"
      {...dropzoneProps}
      tabIndex={tabIndex}
      onClick={undefined}
    >
      <div
        style={{
          width: `calc(100% - 30px)`,
          overflowX: "hidden",
          marginLeft: "0 !important",
        }}
      >
        <Grid container spacing={0.5} wrap="nowrap">
          {Array.isArray(value) &&
            value.map((file: FileValue, i) => (
              <Grid item key={file.downloadURL}>
                <ButtonBase
                  aria-label="Delete…"
                  sx={imgSx(rowHeight)}
                  className="img"
                  onClick={() => {
                    confirm({
                      title: "Delete image?",
                      body: "This image cannot be recovered after",
                      confirm: "Delete",
                      confirmColor: "error",
                      handleConfirm: handleDelete(i),
                    });
                  }}
                  disabled={disabled}
                  tabIndex={tabIndex}
                >
                  <Thumbnail
                    imageUrl={file.downloadURL}
                    size={thumbnailSize}
                    objectFit="contain"
                    sx={thumbnailSx}
                  />
                  <Grid
                    container
                    justifyContent="center"
                    alignItems="center"
                    sx={deleteImgHoverSx}
                  >
                    <DeleteIcon color="error" />
                  </Grid>
                </ButtonBase>
              </Grid>
            ))}

          {localImage && (
            <Grid item>
              <Box
                sx={[
                  imgSx(rowHeight),
                  {
                    boxShadow: (theme) =>
                      `0 0 0 1px ${theme.palette.divider} inset`,
                  },
                ]}
                style={{ backgroundImage: `url("${localImage}")` }}
              />
            </Grid>
          )}
        </Grid>
      </div>

      {!isLoading ? (
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
            <AddIcon />
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
