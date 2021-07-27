import { useCallback } from "react";
import { IHeavyCellProps } from "../types";

import { useDropzone } from "react-dropzone";
import _findIndex from "lodash/findIndex";
import clsx from "clsx";
import { format } from "date-fns";

import {
  makeStyles,
  createStyles,
  fade,
  Grid,
  Tooltip,
  Chip,
  IconButton,
  CircularProgress,
} from "@material-ui/core";
import UploadIcon from "assets/icons/Upload";

import { useConfirmation } from "components/ConfirmationDialog";
import useUploader, { FileValue } from "hooks/useFiretable/useUploader";
import { FileIcon } from ".";
import { DATE_TIME_FORMAT } from "constants/dates";
import { useFiretableContext } from "contexts/FiretableContext";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      padding: theme.spacing(0, 0.75, 0, 1),
      outline: "none",
    },
    dragActive: {
      backgroundColor: fade(
        theme.palette.primary.main,
        theme.palette.action.hoverOpacity * 2
      ),

      "& .row-hover-iconButton": { color: theme.palette.primary.main },
    },

    chipList: { overflow: "hidden" },
    chipGridItem: {
      // Truncate so multiple files still visible
      maxWidth: `calc(100% - ${theme.spacing(3.5)}px)`,
    },
    chip: { width: "100%" },

    endButtonContainer: {
      width: 29 + theme.spacing(1),
    },
    circularProgress: {
      display: "block",
      margin: "0 auto",
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
  const { updateCell } = useFiretableContext();

  const { uploaderState, upload, deleteUpload } = useUploader();
  const { progress, isLoading } = uploaderState;
  const { requestConfirmation } = useConfirmation();
  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        upload({
          docRef: row.ref,
          fieldName: column.key as string,
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
    <Grid
      container
      className={clsx(
        "cell-collapse-padding",
        classes.root,
        isDragActive && classes.dragActive
      )}
      wrap="nowrap"
      alignItems="center"
      spacing={1}
      {...dropzoneProps}
      onClick={undefined}
    >
      <input {...getInputProps()} />

      <Grid item xs className={classes.chipList}>
        <Grid container spacing={1} wrap="nowrap">
          {Array.isArray(value) &&
            value.reverse().map((file: FileValue) => (
              <Grid item key={file.name} className={classes.chipGridItem}>
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
                              body:
                                "Are you sure you want to delete this file?",
                              confirm: "Delete",
                            })
                    }
                    className={classes.chip}
                  />
                </Tooltip>
              </Grid>
            ))}
        </Grid>
      </Grid>

      <Grid item className={classes.endButtonContainer}>
        {!isLoading ? (
          !disabled && (
            <IconButton
              size="small"
              className="row-hover-iconButton"
              onClick={(e) => {
                dropzoneProps.onClick!(e);
                e.stopPropagation();
              }}
            >
              <UploadIcon />
            </IconButton>
          )
        ) : (
          <CircularProgress
            size={24}
            variant={progress === 0 ? "indeterminate" : "static"}
            value={progress}
            thickness={4.6}
            className={classes.circularProgress}
          />
        )}
      </Grid>
    </Grid>
  );
}
