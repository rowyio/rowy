import React, { useCallback, useState } from "react";
import clsx from "clsx";
import { FieldProps } from "formik";

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

export interface IFileUploaderProps extends FieldProps {
  editable?: boolean;
  docRef?: firebase.firestore.DocumentReference;
}

export default function FileUploader({
  form,
  field,
  docRef,
  editable,
}: IFileUploaderProps) {
  const classes = useStyles();

  console.log({ field, editable });
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
    [docRef, field.value]
  );

  const handleDelete = (index: number) => {
    const newValue = [...field.value];
    newValue.splice(index, 1);
    form.setFieldValue(field.name, newValue);
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
          <input id={`sidedrawer-field-${field.name}`} {...getInputProps()} />
          <UploadIcon />
          <Typography variant="body1" color="textSecondary">
            Upload file
          </Typography>
        </ButtonBase>
      )}

      <Grid container spacing={1} className={classes.chipList}>
        {Array.isArray(field.value) &&
          field.value.map((file: FileValue, i) => (
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

      <ErrorMessage name={field.name} />
    </>
  );
}
