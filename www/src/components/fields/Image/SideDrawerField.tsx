import { ISideDrawerFieldProps } from "../types";
import { useCallback, useState } from "react";
import clsx from "clsx";
import { Controller } from "react-hook-form";

import { useDropzone } from "react-dropzone";
import useUploader from "hooks/useFiretable/useUploader";

import {
  makeStyles,
  createStyles,
  fade,
  ButtonBase,
  Typography,
  Grid,
  CircularProgress,
  Tooltip,
} from "@material-ui/core";

import AddIcon from "@material-ui/icons/AddAPhoto";
import DeleteIcon from "@material-ui/icons/Delete";
import OpenIcon from "@material-ui/icons/OpenInNewOutlined";

import { IMAGE_MIME_TYPES } from ".";
import Thumbnail from "components/Thumbnail";
import { useConfirmation } from "components/ConfirmationDialog";
import { useFiretableContext } from "contexts/FiretableContext";

import { useFieldStyles } from "components/SideDrawer/Form/utils";
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

    imagesContainer: {
      marginTop: theme.spacing(1),
    },

    img: {
      position: "relative",
      width: 80,
      height: 80,
      borderRadius: theme.shape.borderRadius,
      // boxShadow: `0 0 0 1px ${theme.palette.divider} inset`,

      backgroundSize: "contain",
      backgroundPosition: "center center",
      backgroundRepeat: "no-repeat",
    },
    thumbnail: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
    },

    overlay: {
      position: "absolute",
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,

      backgroundColor: fade(theme.palette.background.paper, 0.8),
      color: theme.palette.text.secondary,
      boxShadow: `0 0 0 1px ${theme.palette.divider} inset`,
      borderRadius: theme.shape.borderRadius,
    },

    deleteImgHover: {
      transition: theme.transitions.create("background-color", {
        duration: theme.transitions.duration.shortest,
      }),

      backgroundColor: "transparent",

      "$img:hover &": {
        backgroundColor: fade(theme.palette.background.paper, 0.8),
        "& *": { opacity: 1 },
      },

      "& *": {
        opacity: 0,
        transition: theme.transitions.create("opacity", {
          duration: theme.transitions.duration.shortest,
        }),
      },
    },
  })
);

function ControlledImageUploader({
  onChange,
  value,
  column,
  docRef,
  disabled,
}) {
  const classes = useStyles();
  const fieldClasses = useFieldStyles();
  const { updateCell } = useFiretableContext();

  const { requestConfirmation } = useConfirmation();
  const { uploaderState, upload, deleteUpload } = useUploader();
  const { progress } = uploaderState;

  // Store a preview image locally while uploading
  const [localImage, setLocalImage] = useState<string>("");

  const onDrop = useCallback(
    (acceptedFiles) => {
      const imageFile = acceptedFiles[0];

      if (docRef && imageFile) {
        upload({
          docRef,
          fieldName: column.key,
          files: [imageFile],
          previousValue: value ?? [],
          onComplete: (newValue) => {
            if (updateCell) updateCell(docRef, column.key, newValue);
            onChange(newValue);
            setLocalImage("");
          },
        });
        setLocalImage(URL.createObjectURL(imageFile));
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
    accept: IMAGE_MIME_TYPES,
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
          <AddIcon />
          <Typography variant="body1" color="inherit">
            {isDragActive ? "Drop your image here" : "Upload image"}
          </Typography>
        </ButtonBase>
      )}

      <Grid container spacing={1} className={classes.imagesContainer}>
        {Array.isArray(value) &&
          value.map((image, i) => (
            <Grid item key={image.downloadURL}>
              {disabled ? (
                <Tooltip title="Click to open">
                  <ButtonBase
                    className={classes.img}
                    onClick={() => window.open(image.downloadURL, "_blank")}
                  >
                    <Thumbnail
                      imageUrl={image.downloadURL}
                      size="200x200"
                      objectFit="contain"
                      className={classes.thumbnail}
                    />
                    <Grid
                      container
                      justify="center"
                      alignItems="center"
                      className={clsx(classes.overlay, classes.deleteImgHover)}
                    >
                      {disabled ? <OpenIcon /> : <DeleteIcon color="inherit" />}
                    </Grid>
                  </ButtonBase>
                </Tooltip>
              ) : (
                <Tooltip title="Click to delete">
                  <div>
                    <ButtonBase
                      className={classes.img}
                      onClick={() =>
                        requestConfirmation({
                          title: "Delete Image",
                          body: "Are you sure you want to delete this image?",
                          confirm: "Delete",
                          handleConfirm: () => handleDelete(i),
                        })
                      }
                    >
                      <Thumbnail
                        imageUrl={image.downloadURL}
                        size="200x200"
                        objectFit="contain"
                        className={classes.thumbnail}
                      />
                      <Grid
                        container
                        justify="center"
                        alignItems="center"
                        className={clsx(
                          classes.overlay,
                          classes.deleteImgHover
                        )}
                      >
                        <DeleteIcon color="inherit" />
                      </Grid>
                    </ButtonBase>
                  </div>
                </Tooltip>
              )}
            </Grid>
          ))}

        {localImage && (
          <Grid item>
            <ButtonBase
              className={classes.img}
              style={{ backgroundImage: `url("${localImage}")` }}
            >
              <Grid
                container
                justify="center"
                alignItems="center"
                className={classes.overlay}
              >
                <CircularProgress
                  color="inherit"
                  size={48}
                  variant={progress === 0 ? "indeterminate" : "static"}
                  value={progress}
                />
              </Grid>
            </ButtonBase>
          </Grid>
        )}
      </Grid>
    </>
  );
}

export default function Image_({
  control,
  column,
  disabled,
  docRef,
}: ISideDrawerFieldProps) {
  return (
    <Controller
      control={control}
      name={column.key}
      render={({ onChange, value }) => (
        <ControlledImageUploader
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
