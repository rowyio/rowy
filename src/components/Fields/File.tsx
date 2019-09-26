import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import useUploader from "../../hooks/useFiretable/useUploader";

import { FieldType } from ".";
import Chip from "@material-ui/core/Chip";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

// TODO:  indicate state completion / error
// TODO: Create an interface for props

interface Props {
  value: any;
  row: { ref: firebase.firestore.DocumentReference; id: string };
  onSubmit: Function;
  fieldType: FieldType;
  fieldName: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexWrap: "wrap",
    },
    chip: {},
  })
);

const File = (props: Props) => {
  const { fieldName, value, row, onSubmit } = props;
  const classes = useStyles();
  const [uploaderState, upload] = useUploader();
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
    <div {...getRootProps()}>
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
        <p>click to select files</p>
      )}
    </div>
  );
};
export default File;
