import React, { useCallback, useState } from "react";
import clsx from "clsx";
import { Controller } from "react-hook-form";
import { IFieldProps } from "../utils";

import { useDropzone } from "react-dropzone";
import useUploader, { FileValue } from "hooks/useFiretable/useUploader";

import {
  makeStyles,
  createStyles,
  fade,
  ButtonBase,
  Typography,
  Grid,
  Chip,
  CircularProgress,
} from "@material-ui/core";

import UploadIcon from "assets/icons/Upload";
import { FileIcon } from "constants/fields";

import Confirmation from "components/Confirmation";

const useStyles = makeStyles(theme =>
  createStyles({
    dropzoneButton: {
      backgroundColor:
        theme.palette.type === "light"
          ? "rgba(0, 0, 0, 0.09)"
          : "rgba(255, 255, 255, 0.09)",
      borderRadius: theme.shape.borderRadius,
      padding: theme.spacing(0, 2),
      justifyContent: "flex-start",

      margin: 0,
      width: "100%",
      height: 56,

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

export interface IControlledFileUploaderProps
  extends Pick<IFieldProps, "editable" | "docRef" | "name"> {
  onChange: (...event: any[]) => void;
  onBlur: () => void;
  value: any;
}

export function ControlledFileUploader({
  onChange,
  onBlur,
  value,
  name,
  docRef,
  editable,
}: IControlledFileUploaderProps) {
  const classes = useStyles();

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
          fieldName: name,
          files: [file],
          previousValue: value ?? [],
          onComplete: newValue => {
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
      {editable !== false && (
        <ButtonBase
          className={clsx(
            classes.dropzoneButton,
            isDragActive && classes.dropzoneDragActive
          )}
          {...getRootProps()}
        >
          <input id={`sidedrawer-field-${name}`} {...getInputProps()} />
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
              <Confirmation
                message={{
                  title: "Delete File",
                  body: "Are you sure you want to delete this file?",
                  confirm: "Delete",
                }}
                functionName={editable !== false ? "onDelete" : ""}
              >
                <Chip
                  size="medium"
                  icon={<FileIcon />}
                  label={file.name}
                  onClick={() => window.open(file.downloadURL)}
                  onDelete={
                    editable !== false ? () => handleDelete(i) : undefined
                  }
                  className={classes.chip}
                />
              </Confirmation>
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

export default function FileUploader({ control, name, ...props }: IFieldProps) {
  return (
    <Controller
      control={control}
      name={name}
      render={renderProps => (
        <ControlledFileUploader {...props} name={name} {...renderProps} />
      )}
    />
  );
}
