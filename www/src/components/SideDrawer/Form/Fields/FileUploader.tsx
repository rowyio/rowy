import React, { useCallback, useState } from "react";
import clsx from "clsx";
import { FieldProps } from "formik";

import { useDropzone } from "react-dropzone";
import useUploader, { FileValue } from "hooks/useFiretable/useUploader";

import {
  makeStyles,
  createStyles,
  ButtonBase,
  Typography,
  Grid,
  Chip,
  CircularProgress,
} from "@material-ui/core";

import UploadIcon from "assets/icons/Upload";
import { FileIcon } from "constants/fields";

import ErrorMessage from "../ErrorMessage";
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

    chipList: { marginTop: theme.spacing(1) },
    chipGridItem: { maxWidth: "100%" },
    chip: { width: "100%" },
  })
);

export interface IFileUploaderProps extends FieldProps {
  docRef?: firebase.firestore.DocumentReference;
}

export default function FileUploader({
  form,
  field,
  docRef,
}: IFileUploaderProps) {
  const classes = useStyles();

  const [uploaderState, upload] = useUploader();
  const { progress } = uploaderState;

  // Store a preview image locally while uploading
  const [localFile, setLocalFile] = useState<string>("");

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      if (docRef && file) {
        upload({
          docRef,
          fieldName: field.name,
          files: [file],
          previousValue: field.value ?? [],
          onComplete: newValue => {
            form.setFieldValue(field.name, newValue);
            setLocalFile("");
          },
        });
        setLocalFile(file.name);
      }
    },
    [docRef]
  );

  const handleDelete = (index: number) => {
    const newValue = [...field.value];
    newValue.splice(index, 1);
    form.setFieldValue(field.name, newValue);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
  });

  return (
    <>
      <ButtonBase className={classes.dropzoneButton} {...getRootProps()}>
        <input id={`sidemodal-field-${field.name}`} {...getInputProps()} />
        <UploadIcon />
        <Typography variant="body1" color="textSecondary">
          Upload file
        </Typography>
      </ButtonBase>

      <Grid container spacing={1} className={classes.chipList}>
        {field.value.map((file: FileValue, i) => (
          <Grid item key={file.name} className={classes.chipGridItem}>
            <Confirmation
              message={{
                title: "Delete File",
                body: "Are you sure you want to delete this file?",
                confirm: "Delete",
              }}
              functionName="onDelete"
            >
              <Chip
                size="medium"
                icon={<FileIcon />}
                label={file.name}
                onClick={() => window.open(file.downloadURL)}
                onDelete={() => handleDelete(i)}
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
              onDelete={() => {}}
              deleteIcon={
                <CircularProgress size={20} thickness={4.5} color="inherit" />
              }
            />
          </Grid>
        )}
      </Grid>

      <ErrorMessage name={field.name} />
    </>
  );
}
