import { useCallback } from "react";
import { IHeavyCellProps } from "@src/components/fields/types";
import { useSetAtom } from "jotai";
import { findIndex } from "lodash-es";

import { useDropzone } from "react-dropzone";
import { format } from "date-fns";

import { alpha, Stack, Grid, Tooltip, Chip, IconButton } from "@mui/material";
import { Upload as UploadIcon } from "@src/assets/icons";
import ChipList from "@src/components/Table/formatters/ChipList";
import CircularProgressOptical from "@src/components/CircularProgressOptical";

import { projectScope, confirmDialogAtom } from "@src/atoms/projectScope";
import { tableScope, updateFieldAtom } from "@src/atoms/tableScope";
import useUploader from "@src/hooks/useFirebaseStorageUploader";
import { FileIcon } from ".";
import { DATE_TIME_FORMAT } from "@src/constants/dates";
import { FileValue } from "@src/types/table";

export default function File_({
  column,
  row,
  value,
  onSubmit,
  disabled,
  docRef,
}: IHeavyCellProps) {
  const confirm = useSetAtom(confirmDialogAtom, projectScope);
  const updateField = useSetAtom(updateFieldAtom, tableScope);

  const { uploaderState, upload, deleteUpload } = useUploader();
  const { progress, isLoading } = uploaderState;

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      if (file) {
        upload({
          docRef: docRef! as any,
          fieldName: column.key,
          files: [file],
          previousValue: value,
          onComplete: (newValue) => {
            updateField({
              path: docRef.path,
              fieldName: column.key,
              value: newValue,
            });
          },
        });
      }
    },
    [value]
  );

  const handleDelete = (ref: string) => {
    const newValue = [...value];
    const index = findIndex(newValue, ["ref", ref]);
    const toBeDeleted = newValue.splice(index, 1);
    toBeDeleted.length && deleteUpload(toBeDeleted[0]);
    onSubmit(newValue);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  });

  const dropzoneProps = getRootProps();

  return (
    <Stack
      direction="row"
      className="cell-collapse-padding"
      alignItems="center"
      sx={{
        height: "100%",
        pr: 0.5,

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
      onClick={undefined}
    >
      <ChipList>
        {Array.isArray(value) &&
          value.map((file: FileValue) => (
            <Grid
              item
              key={file.downloadURL}
              style={
                // Truncate so multiple files still visible
                value.length > 1 ? { maxWidth: `calc(100% - 12px)` } : {}
              }
            >
              <Tooltip
                title={`File last modified ${format(
                  file.lastModifiedTS,
                  DATE_TIME_FORMAT
                )}`}
              >
                <Chip
                  icon={<FileIcon />}
                  label={file.name}
                  onClick={(e) => {
                    window.open(file.downloadURL);
                    e.stopPropagation();
                  }}
                  onDelete={
                    disabled
                      ? undefined
                      : () =>
                          confirm({
                            handleConfirm: () => handleDelete(file.ref),
                            title: "Delete file?",
                            body: "This file cannot be recovered after",
                            confirm: "Delete",
                            confirmColor: "error",
                          })
                  }
                  style={{ width: "100%" }}
                />
              </Tooltip>
            </Grid>
          ))}
      </ChipList>

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

      <input {...getInputProps()} />
    </Stack>
  );
}
