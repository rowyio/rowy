import { useCallback } from "react";
import { IHeavyCellProps } from "../types";

import { useDropzone } from "react-dropzone";
import _findIndex from "lodash/findIndex";
import clsx from "clsx";
import { format } from "date-fns";

import { makeStyles, createStyles } from "@material-ui/styles";
import {
  alpha,
  Stack,
  Grid,
  Tooltip,
  Chip,
  IconButton,
  CircularProgress,
} from "@material-ui/core";
import UploadIcon from "assets/icons/Upload";

import { useConfirmation } from "components/ConfirmationDialog";
import useUploader, { FileValue } from "hooks/useTable/useUploader";
import { FileIcon } from ".";
import { DATE_TIME_FORMAT } from "constants/dates";
import { useProjectContext } from "contexts/ProjectContext";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      padding: theme.spacing(0, 0.5, 0, 1),
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
    chip: {
      width: "100%",
      height: 24,
      display: "flex",
    },

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
      className={clsx(
        "cell-collapse-padding",
        classes.root,
        isDragActive && classes.dragActive
      )}
      alignItems="center"
      spacing={0.5}
      {...dropzoneProps}
      onClick={undefined}
    >
      <input {...getInputProps()} />

      <div className={classes.chipList}>
        <Grid container spacing={0.5} wrap="nowrap" style={{ height: "100%" }}>
          {Array.isArray(value) &&
            value.map((file: FileValue) => (
              <Grid
                item
                key={file.downloadURL}
                style={
                  value.length > 1
                    ? {
                        // Truncate so multiple files still visible
                        maxWidth: `calc(100% - 12px)`,
                      }
                    : {}
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
                              title: "Delete File",
                              body: "Are you sure you want to delete this file?",
                              confirm: "Delete",
                            })
                    }
                    className={classes.chip}
                  />
                </Tooltip>
              </Grid>
            ))}
        </Grid>
      </div>

      <div className={classes.endButtonContainer}>
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
          <CircularProgress
            size={24}
            variant={progress === 0 ? "indeterminate" : "determinate"}
            value={progress}
            thickness={4}
            className={classes.circularProgress}
          />
        )}
      </div>
    </Stack>
  );
}
