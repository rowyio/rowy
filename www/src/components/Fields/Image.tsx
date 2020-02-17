import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import useUploader from "../../hooks/useFiretable/useUploader";
import DeleteIcon from "@material-ui/icons/Delete";

import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { FieldType } from "constants/fields";
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";
import AddIcon from "@material-ui/icons/AddAPhoto";
import CircularProgress from "@material-ui/core/CircularProgress";

import _findIndex from "lodash/findIndex";
import { Tooltip } from "@material-ui/core";
import Confirmation from "../Confirmation";
// TODO:  indicate error state

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},

    imgContainer: {
      position: "relative",
      display: "inline-block",
      cursor: "pointer",

      backgroundSize: "contain",
      backgroundPosition: "center center",
      backgroundRepeat: "no-repeat",

      boxShadow: `0 0 0 1px ${theme.palette.divider} inset`,
      borderRadius: theme.shape.borderRadius,

      "& + &": { marginLeft: theme.spacing(1) },
    },

    deleteImgHover: {
      position: "absolute",
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,

      backgroundColor: "rgba(255,255,255,0.8)",
      color: theme.palette.text.secondary,
      boxShadow: `0 0 0 1px ${theme.palette.divider} inset`,
      borderRadius: theme.shape.borderRadius,

      opacity: 0,
      transition: theme.transitions.create("opacity", {
        duration: theme.transitions.duration.shortest,
      }),
      "$imgContainer:hover &": { opacity: 1 },
    },
  })
);

interface Props {
  value: any;
  row: {
    ref: firebase.firestore.DocumentReference;
    id: string;
    rowHeight: number;
  };
  onSubmit: Function;
  fieldType: FieldType;
  fieldName: string;
}

const Image = (props: Props) => {
  const classes = useStyles();
  const { fieldName, value, row, onSubmit } = props;

  const [uploaderState, upload] = useUploader();
  const { progress } = uploaderState;
  const [localImage, setLocalImage] = useState<string | null>(null);
  const onDrop = useCallback(acceptedFiles => {
    // Do something with the files
    const imageFile = acceptedFiles[0];
    if (imageFile) {
      upload(row.ref, fieldName, [imageFile], value);
      let url = URL.createObjectURL(imageFile);
      setLocalImage(url);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: ["image/png", "image/jpg", "image/jpeg"],
  });
  const dropzoneProps = getRootProps();

  const files = value ? [...value] : [];
  if (localImage) {
    files.push({ downloadURL: localImage, name: "localImage" });
  }
  return (
    <Grid
      container
      className={classes.root}
      wrap="nowrap"
      alignItems="center"
      {...dropzoneProps}
      onClick={() => {}}
    >
      <input {...getInputProps()} />

      <Grid item xs>
        {value &&
          files.map((file: { name: string; downloadURL: string }) => (
            <Tooltip key={file.downloadURL} title="Click to delete">
              <span>
                <Confirmation
                  message={{
                    title: "Delete Image",
                    body: "Are you sure you want to delete this image?",
                    confirm: (
                      <>
                        <DeleteIcon /> Delete
                      </>
                    ),
                  }}
                >
                  <div
                    onClick={e => {
                      const index = _findIndex(value, [
                        "downloadURL",
                        file.downloadURL,
                      ]);
                      value.splice(index, 1);
                      onSubmit(value);
                    }}
                    className={classes.imgContainer}
                    style={{
                      backgroundImage: `url(${file.downloadURL})`,
                      width: row.rowHeight * 0.9,
                      height: row.rowHeight * 0.9,
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
                  </div>
                </Confirmation>
              </span>
            </Tooltip>
          ))}
      </Grid>

      <Grid item>
        {progress === 0 ? (
          <IconButton onClick={dropzoneProps.onClick} size="small">
            <AddIcon />
          </IconButton>
        ) : (
          <CircularProgress size={30} variant="static" value={progress} />
        )}
      </Grid>
    </Grid>
  );
};
export default Image;
