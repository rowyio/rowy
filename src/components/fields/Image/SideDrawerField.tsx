import { ISideDrawerFieldProps } from "../types";
import { useCallback, useState } from "react";
import clsx from "clsx";
import { Controller } from "react-hook-form";

import { useDropzone } from "react-dropzone";
import useUploader from "@src/hooks/useTable/useUploader";

import { makeStyles, createStyles } from "@mui/styles";
import { alpha, ButtonBase, Typography, Grid, Tooltip } from "@mui/material";

import AddIcon from "@mui/icons-material/AddAPhotoOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import OpenIcon from "@mui/icons-material/OpenInNewOutlined";

import { IMAGE_MIME_TYPES } from ".";
import Thumbnail from "@src/components/Thumbnail";
import CircularProgressOptical from "@src/components/CircularProgressOptical";
import { useConfirmation } from "@src/components/ConfirmationDialog";
import { useProjectContext } from "@src/contexts/ProjectContext";

import { useFieldStyles } from "@src/components/SideDrawer/Form/utils";
const useStyles = makeStyles((theme) =>
  createStyles({
    dropzoneButton: {
      justifyContent: "flex-start",
      color: theme.palette.text.secondary,
    },
    dropzoneDragActive: {
      backgroundColor: alpha(
        theme.palette.primary.light,
        theme.palette.action.hoverOpacity * 2
      ),
      color: theme.palette.primary.main,
    },

    imagesContainer: {
      marginTop: 0,
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

      backgroundColor: alpha(theme.palette.background.paper, 0.8),
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
        backgroundColor: alpha(theme.palette.background.paper, 0.8),
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
  const { updateCell } = useProjectContext();

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
          <Typography color="inherit" style={{ flexGrow: 1 }}>
            {isDragActive
              ? "Drop image here"
              : "Click to upload or drop image here"}
          </Typography>
          <AddIcon sx={{ ml: 1, mr: 2 / 8 }} />
        </ButtonBase>
      )}

      <Grid container spacing={1} className={classes.imagesContainer}>
        {Array.isArray(value) &&
          value.map((image, i) => (
            <Grid item key={image.downloadURL}>
              {disabled ? (
                <Tooltip title="Open">
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
                      justifyContent="center"
                      alignItems="center"
                      className={clsx(classes.overlay, classes.deleteImgHover)}
                    >
                      {disabled ? <OpenIcon /> : <DeleteIcon color="error" />}
                    </Grid>
                  </ButtonBase>
                </Tooltip>
              ) : (
                <Tooltip title="Delete…">
                  <div>
                    <ButtonBase
                      className={classes.img}
                      onClick={() =>
                        requestConfirmation({
                          title: "Delete image?",
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
                        justifyContent="center"
                        alignItems="center"
                        className={clsx(
                          classes.overlay,
                          classes.deleteImgHover
                        )}
                      >
                        <DeleteIcon color="error" />
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
                justifyContent="center"
                alignItems="center"
                className={classes.overlay}
              >
                <CircularProgressOptical
                  color="inherit"
                  size={48}
                  variant={progress === 0 ? "indeterminate" : "determinate"}
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
      render={({ field: { onChange, value } }) => (
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
