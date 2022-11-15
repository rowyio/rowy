import { useState } from "react";
import { IHeavyCellProps } from "@src/components/fields/types";
import { useSetAtom } from "jotai";

import { useDropzone } from "react-dropzone";
import { format } from "date-fns";

import { alpha, Stack, Grid, Tooltip, Chip, IconButton } from "@mui/material";
import { Upload as UploadIcon } from "@src/assets/icons";
import ChipList from "@src/components/Table/formatters/ChipList";
import CircularProgressOptical from "@src/components/CircularProgressOptical";

import { projectScope, confirmDialogAtom } from "@src/atoms/projectScope";
import { FileIcon } from ".";
import { DATE_TIME_FORMAT } from "@src/constants/dates";
import { FileValue } from "@src/types/table";
import useFileUpload from "./useFileUpload";

export default function File_({
  column,
  value,
  disabled,
  docRef,
}: IHeavyCellProps) {
  const confirm = useSetAtom(confirmDialogAtom, projectScope);
  const [localFiles, setLocalFiles] = useState<File[]>([]);

  const { loading, progress, handleUpload, handleDelete } = useFileUpload(
    docRef,
    column.key
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: async (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        setLocalFiles(acceptedFiles);
        await handleUpload(acceptedFiles);
        setLocalFiles([]);
      }
    },
    multiple: true,
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
                  label={file.name}
                  icon={<FileIcon />}
                  sx={{
                    "& .MuiChip-label": {
                      lineHeight: 5 / 3,
                    },
                  }}
                  onClick={(e) => {
                    window.open(file.downloadURL);
                    e.stopPropagation();
                  }}
                  onDelete={
                    disabled
                      ? undefined
                      : () =>
                          confirm({
                            handleConfirm: () => handleDelete(file),
                            title: "Delete file?",
                            body: "This file cannot be recovered after",
                            confirm: "Delete",
                            confirmColor: "error",
                          })
                  }
                />
              </Tooltip>
            </Grid>
          ))}
        {localFiles &&
          localFiles.map((file) => (
            <Grid item>
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

      {!loading ? (
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
