import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import useUploader from "../../hooks/useFiretable/useUploader";

import { FieldType } from ".";
import Chip from "@material-ui/core/Chip";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/NoteAdd";
import CircularProgress from "@material-ui/core/CircularProgress";
// TODO:  indicate state error
// TODO: multi support

interface Props {
  value: { name: string; downloadURL: string }[];
  row: { ref: firebase.firestore.DocumentReference; id: string };
  onSubmit: Function;
  fieldType: FieldType;
  fieldName: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      // flexDirection: "column",
      alignContent: "center",
      width: "100%",
    },
    chip: { margin: theme.spacing(5) },
    progress: { margin: theme.spacing(5) },
  })
);

const File = (props: Props) => {
  const { fieldName, value, row, onSubmit } = props;
  const classes = useStyles();
  const [uploaderState, upload] = useUploader();
  const { progress } = uploaderState;
  const onDrop = useCallback(acceptedFiles => {
    // Do something with the files
    const imageFile = acceptedFiles[0];
    if (imageFile) {
      upload(row.ref, fieldName, [imageFile]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  });
  const handleDelete = () => {
    onSubmit([]);
  };

  return (
    <div className={classes.root} {...getRootProps()}>
      <input {...getInputProps()} />
      {value && value.length !== 0 ? (
        <Chip
          key={value[0].name}
          label={value[0].name}
          className={classes.chip}
          onClick={() => {
            window.open(value[0].downloadURL);
          }}
          onDelete={handleDelete}
        />
      ) : isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <IconButton>
          <AddIcon />
        </IconButton>
      )}
      {progress < 100 ? (
        <div className={classes.progress}>
          <CircularProgress
            size={25}
            variant="determinate"
            value={progress}
            color="secondary"
          />
        </div>
      ) : (
        <div />
      )}
    </div>
  );
};
export default File;
