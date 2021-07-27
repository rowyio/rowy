import { IHeavyCellProps } from "../types";
import { useCallback, useState } from "react";

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
import OpenIcon from "@material-ui/icons/OpenInNewOutlined";

import { useConfirmation } from "components/ConfirmationDialog";
import useUploader, { FileValue } from "hooks/useFiretable/useUploader";
import { IMAGE_MIME_TYPES } from "./index";
import { useFiretableContext } from "contexts/FiretableContext";
import Thumbnail from "components/Thumbnail";

const useStyles = makeStyles((theme) =>
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

      borderRadius: theme.shape.borderRadius,
    }),
    thumbnail: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
    },

    deleteImgHover: {
      position: "absolute",
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,

      color: theme.palette.text.secondary,
      boxShadow: `0 0 0 1px ${theme.palette.divider} inset`,
      borderRadius: theme.shape.borderRadius,

      transition: theme.transitions.create("background-color", {
        duration: theme.transitions.duration.shortest,
      }),

      "& *": {
        opacity: 0,
        transition: theme.transitions.create("opacity", {
          duration: theme.transitions.duration.shortest,
        }),
      },

      "$img:hover &": {
        backgroundColor: fade(theme.palette.background.paper, 0.8),
        "& *": { opacity: 1 },
      },
    },

    localImgPreview: {
      boxShadow: `0 0 0 1px ${theme.palette.divider} inset`,
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

export default function Image_({
  column,
  row,
  value,
  onSubmit,
  disabled,
}: IHeavyCellProps) {
  const { tableState, updateCell } = useFiretableContext();
  const { requestConfirmation } = useConfirmation();
  const classes = useStyles({ rowHeight: tableState?.config?.rowHeight ?? 44 });

  const { uploaderState, upload, deleteUpload } = useUploader();
  const { progress, isLoading } = uploaderState;

  // Store a preview image locally while uploading
  const [localImage, setLocalImage] = useState<string>("");

  const onDrop = useCallback(
    (acceptedFiles) => {
      const imageFile = acceptedFiles[0];

      if (imageFile) {
        upload({
          docRef: row.ref,
          fieldName: column.key as string,
          files: [imageFile],
          previousValue: value,
          onComplete: (newValue) => {
            if (updateCell) updateCell(row.ref, column.key, newValue);
            setLocalImage("");
          },
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

  let thumbnailSize = "100x100";
  if (tableState?.config?.rowHeight) {
    if (tableState!.config!.rowHeight! > 50) thumbnailSize = "200x200";
    if (tableState!.config!.rowHeight! > 100) thumbnailSize = "400x400";
  }

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
                    >
                      <Thumbnail
                        imageUrl={file.downloadURL}
                        size={thumbnailSize}
                        objectFit="contain"
                        className={classes.thumbnail}
                      />
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
                      <ButtonBase
                        className={classes.img}
                        onClick={() => {
                          requestConfirmation({
                            title: "Delete Image",
                            body: "Are you sure you want to delete this image?",
                            confirm: "Delete",
                            handleConfirm: handleDelete(file.ref),
                          });
                        }}
                      >
                        <Thumbnail
                          imageUrl={file.downloadURL}
                          size={thumbnailSize}
                          objectFit="contain"
                          className={classes.thumbnail}
                        />
                        <Grid
                          container
                          justify="center"
                          alignItems="center"
                          className={classes.deleteImgHover}
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
              <div
                className={clsx(classes.img, classes.localImgPreview)}
                style={{ backgroundImage: `url("${localImage}")` }}
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
              onClick={(e) => {
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
