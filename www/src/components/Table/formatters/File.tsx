import React, { useCallback } from "react";
import { CustomCellProps } from "./withCustomCell";
import { useDropzone } from "react-dropzone";
import _findIndex from "lodash/findIndex";
import clsx from "clsx";

import {
  makeStyles,
  createStyles,
  fade,
  Grid,
  Chip,
  IconButton,
  CircularProgress,
} from "@material-ui/core";
import UploadIcon from "assets/icons/Upload";

import Confirmation from "components/Confirmation";
import useUploader from "hooks/useFiretable/useUploader";
import { FileIcon } from "constants/fields";

const useStyles = makeStyles(theme =>
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

export default function File({
  column,
  row,
  value,
  onSubmit,
}: CustomCellProps) {
  const classes = useStyles();

  const [uploaderState, upload] = useUploader();
  const { progress, isLoading } = uploaderState;

  const onDrop = useCallback(
    acceptedFiles => {
      const file = acceptedFiles[0];

      if (file) {
        upload({
          docRef: row.ref,
          fieldName: column.key as string,
          files: [file],
          previousValue: value,
        });
      }
    },
    [value]
  );

  const handleDelete = (downloadURL: string) => {
    const newValue = [...value];
    const index = _findIndex(newValue, ["downloadURL", downloadURL]);
    newValue.splice(index, 1);
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
            value.reverse().map((file: any) => (
              <Grid item key={file.name} className={classes.chipGridItem}>
                <Confirmation
                  message={{
                    title: "Delete File",
                    body: "Are you sure you want to delete this file?",
                    confirm: "Delete",
                  }}
                  functionName={column.editable !== false ? "onDelete" : ""}
                  stopPropagation
                >
                  <Chip
                    icon={<FileIcon />}
                    label={file.name}
                    onClick={e => {
                      window.open(file.downloadURL);
                      e.stopPropagation();
                    }}
                    onDelete={
                      column.editable !== false
                        ? () => handleDelete(file.downloadURL)
                        : undefined
                    }
                    className={classes.chip}
                  />
                </Confirmation>
              </Grid>
            ))}
        </Grid>
      </Grid>

      <Grid item className={classes.endButtonContainer}>
        {!isLoading ? (
          column.editable !== false && (
            <IconButton
              size="small"
              className="row-hover-iconButton"
              onClick={e => {
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
