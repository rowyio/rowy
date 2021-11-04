import { useCallback } from "react";
import { IHeavyCellProps } from "../types";

import { useDropzone } from "react-dropzone";
import _findIndex from "lodash/findIndex";
import { format } from "date-fns";

import { makeStyles, createStyles } from "@mui/styles";
import { alpha, Stack, Grid, Tooltip, Chip, IconButton } from "@mui/material";
import UploadIcon from "@src/assets/icons/Upload";
import ChipList from "@src/components/Table/formatters/ChipList";
import CircularProgressOptical from "@src/components/CircularProgressOptical";

import { useConfirmation } from "@src/components/ConfirmationDialog";
import useUploader, { FileValue } from "@src/hooks/useTable/useUploader";
import { FileIcon } from ".";
import { DATE_TIME_FORMAT } from "@src/constants/dates";
import { useProjectContext } from "@src/contexts/ProjectContext";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      paddingRight: theme.spacing(0.5),
      outline: "none",
    },
    dragActive: {
      backgroundColor: alpha(
        theme.palette.primary.main,
        theme.palette.action.hoverOpacity * 2
      ),

      "& .row-hover-iconButton": { color: theme.palette.primary.main },
    },

    chipList: {
      overflow: "hidden",
      flexGrow: 1,
      marginLeft: "0 !important",
    },
    chip: { width: "100%" },

    endButtonContainer: {},
    circularProgress: {
      color: theme.palette.action.active,
      display: "block",
      margin: theme.spacing(0, 0.5),
    },
  })
);

export default function File_({
  column,
  row,
  value,
  onSubmit,
  disabled,
}: IHeavyCellProps) {
  const classes = useStyles();
  const { updateCell } = useProjectContext();

  const { uploaderState, upload, deleteUpload } = useUploader();
  const { progress, isLoading } = uploaderState;
  const { requestConfirmation } = useConfirmation();
  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        upload({
          docRef: row.ref,
          fieldName: column.key,
          files: [file],
          previousValue: value,
          onComplete: (newValue) => {
            if (updateCell) updateCell(row.ref, column.key, newValue);
          },
        });
      }
    },
    [value]
  );

  const handleDelete = (ref: string) => {
    const newValue = [...value];
    const index = _findIndex(newValue, ["ref", ref]);
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
                          requestConfirmation({
                            handleConfirm: () => handleDelete(file.ref),
                            title: "Delete file",
                            body: "Are you sure you want to delete this file?",
                            confirm: "Delete",
                          })
                  }
                  className={classes.chip}
                />
              </Tooltip>
            </Grid>
          ))}
      </ChipList>

      {!isLoading ? (
        !disabled && (
          <IconButton
            size="small"
            className="row-hover-iconButton"
            onClick={(e) => {
              dropzoneProps.onClick!(e);
              e.stopPropagation();
            }}
            style={{ display: "flex" }}
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
