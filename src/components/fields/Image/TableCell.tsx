import { useCallback, useState } from "react";
import { IHeavyCellProps } from "@src/components/fields/types";
import { useAtom, useSetAtom } from "jotai";
import { findIndex } from "lodash-es";

import { useDropzone } from "react-dropzone";

import {
  alpha,
  Theme,
  Box,
  Stack,
  Grid,
  IconButton,
  ButtonBase,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/AddAPhotoOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import OpenIcon from "@mui/icons-material/OpenInNewOutlined";

import Thumbnail from "@src/components/Thumbnail";
import CircularProgressOptical from "@src/components/CircularProgressOptical";

import { globalScope, confirmDialogAtom } from "@src/atoms/globalScope";
import {
  tableSchemaAtom,
  tableScope,
  updateFieldAtom,
} from "@src/atoms/tableScope";
import useUploader from "@src/hooks/useFirebaseStorageUploader";
import { IMAGE_MIME_TYPES } from "./index";
import { DEFAULT_ROW_HEIGHT } from "@src/components/Table";
import { FileValue } from "@src/types/table";

// MULTIPLE
const imgSx = (rowHeight: number) => ({
  position: "relative",
  display: "flex",

  width: (theme: Theme) => `calc(${rowHeight}px - ${theme.spacing(1)} - 1px)`,
  height: (theme: Theme) => `calc(${rowHeight}px - ${theme.spacing(1)} - 1px)`,

  backgroundSize: "contain",
  backgroundPosition: "center center",
  backgroundRepeat: "no-repeat",

  borderRadius: 1,
});
const thumbnailSx = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
};
const deleteImgHoverSx = {
  position: "absolute",
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,

  color: "text.secondary",
  boxShadow: (theme: Theme) => `0 0 0 1px ${theme.palette.divider} inset`,
  borderRadius: 1,

  transition: (theme: Theme) =>
    theme.transitions.create("background-color", {
      duration: theme.transitions.duration.shortest,
    }),

  "& *": {
    opacity: 0,
    transition: (theme: Theme) =>
      theme.transitions.create("opacity", {
        duration: theme.transitions.duration.shortest,
      }),
  },

  ".img:hover &": {
    backgroundColor: (theme: Theme) =>
      alpha(theme.palette.background.paper, 0.8),
    "& *": { opacity: 1 },
  },
};

export default function Image_({
  column,
  row,
  value,
  onSubmit,
  disabled,
  docRef,
}: IHeavyCellProps) {
  const confirm = useSetAtom(confirmDialogAtom, globalScope);
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
          docRef: docRef! as any,
          fieldName: column.key,
          files: [imageFile],
          previousValue: value,
          onComplete: (newValue) => {
            updateField({
              path: docRef.path,
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

  const handleDelete = (ref: string) => () => {
    const newValue = [...value];
    const index = findIndex(newValue, ["ref", ref]);
    const toBeDeleted = newValue.splice(index, 1);
    toBeDeleted.length && deleteUpload(toBeDeleted[0]);
    onSubmit(newValue);
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
          pr: 0.5,
          outline: "none",
          height: "100%",
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
            value.map((file: FileValue) => (
              <Grid item key={file.downloadURL}>
                {disabled ? (
                  <Tooltip title="Open">
                    <ButtonBase
                      sx={imgSx(rowHeight)}
                      className="img"
                      onClick={() => window.open(file.downloadURL, "_blank")}
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
                        {disabled ? (
                          <OpenIcon />
                        ) : (
                          <DeleteIcon color="inherit" />
                        )}
                      </Grid>
                    </ButtonBase>
                  </Tooltip>
                ) : (
                  <Tooltip title="Delete…">
                    <div>
                      <ButtonBase
                        sx={imgSx(rowHeight)}
                        className="img"
                        onClick={() => {
                          confirm({
                            title: "Delete image?",
                            body: "This image cannot be recovered after",
                            confirm: "Delete",
                            confirmColor: "error",
                            handleConfirm: handleDelete(file.ref),
                          });
                        }}
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
                    </div>
                  </Tooltip>
                )}
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
            className={docRef && "row-hover-iconButton"}
            disabled={!docRef}
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

      <input {...getInputProps()} />
    </Stack>
  );
}
