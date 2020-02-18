import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

import {
  createStyles,
  makeStyles,
  Grid,
  Chip,
  IconButton,
  CircularProgress,
} from "@material-ui/core";
import UploadIcon from "@material-ui/icons/Publish";

import useUploader, { FileValue } from "hooks/useFiretable/useUploader";

import { FieldType, FileIcon } from "constants/fields";
import _findIndex from "lodash/findIndex";

// TODO:  indicate state error

interface Props {
  value: FileValue[];
  row: { ref: firebase.firestore.DocumentReference; id: string };
  onSubmit: Function;
  fieldType: FieldType;
  fieldName: string;
  config: any;
}

const useStyles = makeStyles(theme =>
  createStyles({
    root: { marginTop: 0 },
    progress: { margin: theme.spacing(5) },

    chipList: { overflow: "hidden" },
    chipGridItem: { maxWidth: "100%" },
    chip: { cursor: "pointer", width: "100%" },
    uploadButton: { marginLeft: "auto" },
  })
);

const File = (props: Props) => {
  const { fieldName, value, row, onSubmit, config } = props;
  const classes = useStyles();
  const [uploaderState, upload] = useUploader();
  const { progress, isLoading } = uploaderState;
  const onDrop = useCallback(acceptedFiles => {
    // Do something with the files
    const imageFile = acceptedFiles[0];
    if (imageFile) {
      upload({
        docRef: row.ref,
        fieldName,
        files: [imageFile],
        previousValue: value,
      });
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
    <Grid
      container
      className={classes.root}
      wrap="nowrap"
      alignItems="center"
      spacing={1}
      {...dropzoneProps}
    >
      <input {...getInputProps()} />

      <Grid item xs className={classes.chipList}>
        <Grid container spacing={1}>
          {value && value.length > 0 ? (
            value.map((file: any) => (
              <Grid key={file.name} item className={classes.chipGridItem}>
                <Chip
                  icon={<FileIcon />}
                  label={file.name}
                  component="a"
                  target="_blank"
                  rel="noopener noreferrer"
                  href={file.downloadURL}
                  onDelete={
                    config && config.isLocked
                      ? undefined
                      : () => handleDelete(file.downloadURL)
                  }
                  className={classes.chip}
                  onClick={e => e.stopPropagation()}
                />
              </Grid>
            ))
          ) : (
            <Grid item>Upload a file…</Grid>
          )}
        </Grid>
      </Grid>

      <Grid item>
        {!isLoading && progress === 0 ? (
          <IconButton size="small">
            <UploadIcon />
          </IconButton>
        ) : (
          <CircularProgress
            size={30}
            variant={progress === 0 ? "indeterminate" : "static"}
            value={progress}
          />
        )}
      </Grid>
    </Grid>
  );
};
export default File;
