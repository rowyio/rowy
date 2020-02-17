import React, { useCallback, useState, useEffect } from "react";
import clsx from "clsx";
import { FieldProps } from "formik";

import { useDropzone } from "react-dropzone";
import useUploader from "hooks/useFiretable/useUploader";

import {
  makeStyles,
  createStyles,
  FormControl,
  Grid,
  ButtonBase,
  CardMedia,
  CircularProgress,
  Tooltip,
  FormHelperText,
} from "@material-ui/core";

import AddIcon from "@material-ui/icons/AddAPhoto";
import DeleteIcon from "@material-ui/icons/Delete";

import Label from "../Label";
import ErrorMessage from "../ErrorMessage";

const useStyles = makeStyles(theme =>
  createStyles({
    button: {
      position: "relative",

      width: 120,
      height: 120,
      borderRadius: theme.shape.borderRadius,

      marginTop: theme.spacing(0.5),

      // From https://github.com/mui-org/material-ui/blob/master/packages/material-ui/src/FilledInput/FilledInput.js
      transition: theme.transitions.create("background-color", {
        duration: theme.transitions.duration.shorter,
        easing: theme.transitions.easing.easeOut,
      }),
      backgroundColor: "rgba(0, 0, 0, 0.09)",
      "&:hover": {
        backgroundColor: "rgba(0, 0, 0, 0.13)",
        "& $icon": { color: theme.palette.text.secondary },
      },
    },

    icon: {
      color: theme.palette.text.disabled,
      fontSize: 48,
      transition: theme.transitions.create("color", {
        duration: theme.transitions.duration.shorter,
        easing: theme.transitions.easing.easeOut,
      }),
    },

    fullSize: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: theme.shape.borderRadius,
    },

    overlay: {
      background: "rgba(0, 0, 0, 0.4)",
      color: theme.palette.common.white,

      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },

    iconOverlay: {
      opacity: 0,
      transition: theme.transitions.create("opacity", {
        duration: theme.transitions.duration.shorter,
        easing: theme.transitions.easing.easeOut,
      }),
      "&:hover": { opacity: 1 },

      "& $icon": { color: theme.palette.common.white },
      "&:hover $icon": { color: theme.palette.common.white },
    },
  })
);

export interface IImageUploaderProps extends FieldProps {
  label: React.ReactNode;
  docRef?: firebase.firestore.DocumentReference;
}

export default function ImageUploader({
  form,
  field,
  label,
  docRef,
}: IImageUploaderProps) {
  const classes = useStyles();

  const [uploaderState, upload, uploaderDispatch] = useUploader();
  const { progress, isLoading } = uploaderState;

  // TODO: SHOW ERROR MESSAGES FROM USEUPLOADER

  // Store a preview image locally
  const initialImage = field.value?.[0]?.downloadURL || "";
  const [localImage, setLocalImage] = useState<string>(initialImage);

  useEffect(() => {
    if (!docRef && !isLoading) uploaderDispatch({ isLoading: true });
    if (docRef && isLoading) uploaderDispatch({ isLoading: false });
  }, [docRef]);

  const onDrop = useCallback(
    acceptedFiles => {
      const imageFile = acceptedFiles[0];

      if (docRef && imageFile) {
        upload({
          docRef,
          fieldName: field.name,
          files: [imageFile],
          onComplete: newValue => form.setFieldValue(field.name, newValue),
        });
        setLocalImage(URL.createObjectURL(imageFile));
      }
    },
    [docRef]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    accept: [
      "image/jpeg",
      "image/png",
      "image/svg+xml",
      "image/gif",
      "image/webp",
    ],
  });

  return (
    <FormControl onClick={() => form.setFieldTouched(field.name)}>
      <Label error={!!(form.errors[field.name] && form.touched[field.name])}>
        {label}
      </Label>

      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <ButtonBase className={classes.button}>
          {!localImage && <AddIcon className={classes.icon} />}

          {localImage && (
            <CardMedia
              image={localImage}
              title={`Your uploaded ${label}`}
              className={classes.fullSize}
            />
          )}

          {isLoading && (
            <Grid
              container
              justify="center"
              alignItems="center"
              className={clsx(classes.fullSize, classes.overlay)}
            >
              <Grid item>
                <CircularProgress
                  color="inherit"
                  size={48}
                  variant={progress === 0 ? "indeterminate" : "static"}
                  value={progress}
                />
              </Grid>
            </Grid>
          )}

          {localImage && !isLoading && (
            <Tooltip title="Click to upload a new image">
              <Grid
                container
                justify="center"
                alignItems="center"
                className={clsx(
                  classes.fullSize,
                  classes.overlay,
                  classes.iconOverlay
                )}
              >
                <AddIcon className={classes.icon} />
              </Grid>
            </Tooltip>
          )}
        </ButtonBase>
      </div>

      <ErrorMessage name={field.name} />
    </FormControl>
  );
}
