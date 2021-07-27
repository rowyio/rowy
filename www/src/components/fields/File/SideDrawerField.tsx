import { useCallback, useState } from "react";
import { ISideDrawerFieldProps } from "../types";
import clsx from "clsx";
import { Controller } from "react-hook-form";
import { format } from "date-fns";

import { useDropzone } from "react-dropzone";
import useUploader, { FileValue } from "hooks/useFiretable/useUploader";

import {
  makeStyles,
  createStyles,
  fade,
  ButtonBase,
  Typography,
  Grid,
  Tooltip,
  Chip,
  CircularProgress,
} from "@material-ui/core";
import UploadIcon from "assets/icons/Upload";
import { FileIcon } from ".";

import Confirmation from "components/Confirmation";
import { DATE_TIME_FORMAT } from "constants/dates";

import { useFieldStyles } from "components/SideDrawer/Form/utils";
import { useFiretableContext } from "contexts/FiretableContext";

const useStyles = makeStyles((theme) =>
  createStyles({
    dropzoneButton: {
      justifyContent: "flex-start",
      color: theme.palette.text.secondary,
      "& svg": { marginRight: theme.spacing(2) },
    },
    dropzoneDragActive: {
      backgroundColor: fade(
        theme.palette.primary.light,
        theme.palette.action.hoverOpacity * 2
      ),
      color: theme.palette.primary.main,
    },

    chipList: { marginTop: theme.spacing(1) },
    chipGridItem: { maxWidth: "100%" },
    chip: { width: "100%" },
  })
);

function ControlledFileUploader({
  onChange,

  value,
  column,
  docRef,
  disabled,
}) {
  const classes = useStyles();
  const fieldClasses = useFieldStyles();
  const { updateCell } = useFiretableContext();

  const { uploaderState, upload, deleteUpload } = useUploader();
  const { progress } = uploaderState;

  // Store a preview image locally while uploading
  const [localFile, setLocalFile] = useState<string>("");

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      if (docRef && file) {
        upload({
          docRef,
          fieldName: column.key,
          files: [file],
          previousValue: value ?? [],
          onComplete: (newValue) => {
            if (updateCell) updateCell(docRef, column.key, newValue);
            onChange(newValue);
            setLocalFile("");
          },
        });
        setLocalFile(file.name);
      }
    },
    [docRef, value]
  );

  const handleDelete = (index: number) => {
    const newValue = [...value];
    const toBeDeleted = newValue.splice(index, 1);
    toBeDeleted.length && deleteUpload(toBeDeleted[0]);
    onChange(newValue);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  });

  return (
    <>
      {!disabled && (
        <ButtonBase
          className={clsx(
            fieldClasses.root,
            classes.dropzoneButton,
            isDragActive && classes.dropzoneDragActive
          )}
          {...getRootProps()}
        >
          <input id={`sidedrawer-field-${column.key}`} {...getInputProps()} />
          <UploadIcon />
          <Typography variant="body1" color="textSecondary">
            Upload file
          </Typography>
        </ButtonBase>
      )}

      <Grid container spacing={1} className={classes.chipList}>
        {Array.isArray(value) &&
          value.map((file: FileValue, i) => (
            <Grid item key={file.name} className={classes.chipGridItem}>
              <Tooltip
                title={`File last modified ${format(
                  file.lastModifiedTS,
                  DATE_TIME_FORMAT
                )}`}
              >
                <div>
                  <Confirmation
                    message={{
                      title: "Delete File",
                      body: "Are you sure you want to delete this file?",
                      confirm: "Delete",
                    }}
                    functionName={!disabled ? "onDelete" : ""}
                  >
                    <Chip
                      size="medium"
                      icon={<FileIcon />}
                      label={file.name}
                      onClick={() => window.open(file.downloadURL)}
                      onDelete={!disabled ? () => handleDelete(i) : undefined}
                      className={classes.chip}
                    />
                  </Confirmation>
                </div>
              </Tooltip>
            </Grid>
          ))}

        {localFile && (
          <Grid item className={classes.chipGridItem}>
            <Chip
              size="medium"
              icon={<FileIcon />}
              label={localFile}
              className={classes.chip}
              //onDelete={() => {}}
              deleteIcon={
                <CircularProgress size={20} thickness={4.5} color="inherit" />
              }
            />
          </Grid>
        )}
      </Grid>
    </>
  );
}

export default function File_({
  control,
  column,
  disabled,
  docRef,
}: ISideDrawerFieldProps) {
  return (
    <Controller
      control={control}
      name={column.key}
      render={({ onChange, onBlur, value }) => (
        <ControlledFileUploader
          disabled={disabled}
          column={column}
          docRef={docRef}
          onChange={onChange}
          value={value}
        />
      )}
    />
  );
}
