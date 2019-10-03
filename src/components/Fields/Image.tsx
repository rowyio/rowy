import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import useUploader from "../../hooks/useFiretable/useUploader";

import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { FieldType } from ".";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/AddAPhoto";
import CircularProgress from "@material-ui/core/CircularProgress";
// TODO:  indicate state completion / error
// TODO: Create an interface for props

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      // flexDirection: "column",
      alignContent: "center",
      width: "100%",
    },

    uploadingContainer: {
      display: "flex",
      alignContent: "center",
      flexDirection: "row",
      // justifyItems: "space-between",
      justifyContent: "space-between",
    },
    progress: {
      margin: theme.spacing(3),
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
  const { fieldName, value, row } = props;
  const [uploaderState, upload] = useUploader();
  const { progress } = uploaderState;
  const [localImage, setLocalImage] = useState<string | null>(null);
  const onDrop = useCallback(acceptedFiles => {
    // Do something with the files
    const imageFile = acceptedFiles[0];
    if (imageFile) {
      upload(row.ref, fieldName, [imageFile]);
      let url = URL.createObjectURL(imageFile);
      setLocalImage(url);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: ["image/png", "image/jpg", "image/jpeg"],
  });
  return (
    <div className={classes.root} {...getRootProps()}>
      <input {...getInputProps()} />
      {localImage ? (
        <div className={classes.uploadingContainer}>
          <img
            style={{
              padding: `${row.rowHeight * 0.03}px`,
              height: `${row.rowHeight * 0.95}px`,
            }}
            src={localImage}
          />
          {progress < 100 ? (
            <div className={classes.progress}>
              <CircularProgress
                size={row.rowHeight * 0.5}
                variant="determinate"
                value={progress}
                color="secondary"
              />
            </div>
          ) : (
            <div />
          )}
          <div />
        </div>
      ) : value ? (
        <img
          style={{
            padding: `${row.rowHeight * 0.03}px`,
            height: `${row.rowHeight * 0.95}px`,
          }}
          src={value[0].downloadURL}
        />
      ) : isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <IconButton>
          <AddIcon />
        </IconButton>
      )}
    </div>
  );
};
export default Image;
