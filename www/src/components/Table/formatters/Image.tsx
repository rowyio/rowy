import React, { useCallback, useState } from "react";
import { CustomCellProps } from "./withCustomCell";
import { useDropzone } from "react-dropzone";
import _findIndex from "lodash/findIndex";
import clsx from "clsx";

import {
  makeStyles,
  createStyles,
  fade,
  Grid,
  IconButton,
  ButtonBase,
  CircularProgress,
  Tooltip,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/AddAPhoto";
import DeleteIcon from "@material-ui/icons/Delete";
import OpenIcon from "@material-ui/icons/OpenInBrowser";

import Confirmation from "components/Confirmation";
import useUploader, { FileValue } from "hooks/useFiretable/useUploader";
import { IMAGE_MIME_TYPES } from "constants/fields";
import { useFiretableContext } from "contexts/firetableContext";

const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      padding: theme.spacing(0, 0.875, 0, 1.125),
      outline: "none",
    },
    dragActive: {
      backgroundColor: fade(
        theme.palette.primary.main,
        theme.palette.action.hoverOpacity * 2
      ),

      "& .row-hover-iconButton": { color: theme.palette.primary.main },
    },

    imglistContainer: {
      maxWidth: `calc(100% - 30px)`,
      overflowX: "hidden",
    },

    img: ({ rowHeight }: { rowHeight: number }) => ({
      position: "relative",
      display: "flex",

      width: rowHeight - theme.spacing(1) - 1,
      height: rowHeight - theme.spacing(1) - 1,

      backgroundSize: "contain",
      backgroundPosition: "center center",
      backgroundRepeat: "no-repeat",

      boxShadow: `0 0 0 1px ${theme.palette.divider} inset`,
      borderRadius: theme.shape.borderRadius / 2,
    }),

    deleteImgHover: {
      position: "absolute",
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,

      backgroundColor: "rgba(255, 255, 255, 0.8)",
      color: theme.palette.text.secondary,
      boxShadow: `0 0 0 1px ${theme.palette.divider} inset`,
      borderRadius: theme.shape.borderRadius / 2,

      opacity: 0,
      transition: theme.transitions.create("opacity", {
        duration: theme.transitions.duration.shortest,
      }),
      "$img:hover &": { opacity: 1 },
    },

    endButtonContainer: {
      width: 29 + theme.spacing(1),
    },
    circularProgress: {
      display: "block",
      margin: "0 auto",
    },
  })
);

export default function Image({
  column,
  row,
  value,
  onSubmit,
}: CustomCellProps) {
  const { tableState } = useFiretableContext();
  const classes = useStyles({ rowHeight: tableState?.config?.rowHeight ?? 44 });

  const { uploaderState, upload, deleteUpload } = useUploader();
  const { progress, isLoading } = uploaderState;

  // Store a preview image locally while uploading
  const [localImage, setLocalImage] = useState<string>("");

  const onDrop = useCallback(
    acceptedFiles => {
      const imageFile = acceptedFiles[0];

      if (imageFile) {
        upload({
          docRef: row.ref,
          fieldName: column.key as string,
          files: [imageFile],
          previousValue: value,
          onComplete: () => setLocalImage(""),
        });
        setLocalImage(URL.createObjectURL(imageFile));
      }
    },
    [value]
  );

  const handleDelete = (ref: string) => () => {
    const newValue = [...value];
    const index = _findIndex(newValue, ["ref", ref]);
    const toBeDeleted = newValue.splice(index, 1);
    toBeDeleted.length && deleteUpload(toBeDeleted[0]);
    onSubmit(newValue);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: IMAGE_MIME_TYPES,
  });

  const dropzoneProps = getRootProps();
  const disabled = column.editable === false;
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

      <Grid item xs className={classes.imglistContainer}>
        <Grid container spacing={1} wrap="nowrap">
          {Array.isArray(value) &&
            value.map((file: FileValue) => (
              <Grid item key={file.downloadURL}>
                {disabled ? (
                  <Tooltip title="Click to open">
                    <ButtonBase
                      className={classes.img}
                      onClick={() => window.open(file.downloadURL, "_blank")}
                      style={{
                        backgroundImage: `url(${file.downloadURL})`,
                      }}
                    >
                      <Grid
                        container
                        justify="center"
                        alignItems="center"
                        className={classes.deleteImgHover}
                      >
                        {disabled ? (
                          <OpenIcon />
                        ) : (
                          <DeleteIcon color="inherit" />
                        )}
                      </Grid>
                    </ButtonBase>
                  </Tooltip>
                ) : (
                  <Tooltip title="Click to delete">
                    <div>
                      <Confirmation
                        message={{
                          title: "Delete Image",
                          body: "Are you sure you want to delete this image?",
                          confirm: "Delete",
                        }}
                        stopPropagation
                      >
                        <ButtonBase
                          className={classes.img}
                          onClick={handleDelete(file.ref)}
                          style={{
                            backgroundImage: `url(${file.downloadURL})`,
                          }}
                        >
                          <Grid
                            container
                            justify="center"
                            alignItems="center"
                            className={classes.deleteImgHover}
                          >
                            <DeleteIcon color="inherit" />
                          </Grid>
                        </ButtonBase>
                      </Confirmation>
                    </div>
                  </Tooltip>
                )}
              </Grid>
            ))}

          {localImage && (
            <Grid item>
              <div
                className={classes.img}
                style={{ backgroundImage: `url(${localImage})` }}
              />
            </Grid>
          )}
        </Grid>
      </Grid>

      <Grid item className={classes.endButtonContainer}>
        {!isLoading ? (
          !disabled && (
            <IconButton
              size="small"
              className="row-hover-iconButton"
              onClick={e => {
                dropzoneProps.onClick!(e);
                e.stopPropagation();
              }}
              color="inherit"
            >
              <AddIcon />
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
