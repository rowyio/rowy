import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import useUploader from "../../hooks/useFiretable/useUploader";

import { FieldType } from ".";
import Chip from "@material-ui/core/Chip";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/NoteAdd";
import CircularProgress from "@material-ui/core/CircularProgress";
import _findIndex from "lodash/findIndex";

// TODO:  indicate state error

interface Props {
  value: { name: string; downloadURL: string }[];
  row: { ref: firebase.firestore.DocumentReference; id: string };
  onSubmit: Function;
  fieldType: FieldType;
  fieldName: string;
  config: any;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      // flexDirection: "column",
      alignContent: "center",
      width: "100%",
    },
    chip: { margin: theme.spacing(5), maxWidth: 200 },
    progress: { margin: theme.spacing(5) },
    addIcon: {
      maxHeight: 48,
    },
  })
);

const File = (props: Props) => {
  const { fieldName, value, row, onSubmit, config } = props;
  const classes = useStyles();
  const [uploaderState, upload] = useUploader();
  const { progress } = uploaderState;
  const onDrop = useCallback(acceptedFiles => {
    // Do something with the files
    const imageFile = acceptedFiles[0];
    if (imageFile) {
      upload(row.ref, fieldName, [imageFile], value);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  });
  const handleDelete = (downloadURL: string) => {
    const index = _findIndex(value, ["downloadURL", downloadURL]);
    value.splice(index, 1);
    onSubmit(value);
  };
  const dropzoneProps = getRootProps();
  return (
    <div className={classes.root} {...dropzoneProps} onClick={() => {}}>
      <input {...getInputProps()} />
      {value &&
        value.map((file: any) => {
          return (
            <Chip
              key={file.name}
              label={file.name}
              className={classes.chip}
              onClick={() => {
                window.open(file.downloadURL);
              }}
              onDelete={
                config && config.isLocked
                  ? undefined
                  : () => {
                      handleDelete(file.downloadURL);
                    }
              }
            />
          );
        })}

      {config && config.isLocked ? (
        <></>
      ) : (
        <IconButton className={classes.addIcon} onClick={dropzoneProps.onClick}>
          <AddIcon />
        </IconButton>
      )}
    </div>
  );
};
export default File;
