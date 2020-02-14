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

import useUploader from "../../hooks/useFiretable/useUploader";

import { FieldType, FileIcon } from "constants/fields";
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

const useStyles = makeStyles(theme =>
  createStyles({
    root: {},
    progress: { margin: theme.spacing(5) },

    chipList: { overflow: "hidden" },
    chip: { cursor: "pointer" },
    uploadButton: { marginLeft: "auto" },
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
        <>
          {value &&
            value.map((file: any) => (
              <Chip
                key={file.name}
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
            ))}

          {!value || (value.length === 0 && "Upload a file…")}
        </>
      </Grid>

      <Grid item>
        {config && !config.isLocked ? (
          <></>
        ) : (
          <IconButton
            className={classes.uploadButton}
            onClick={dropzoneProps.onClick}
            size="small"
          >
            <UploadIcon />
          </IconButton>
        )}
      </Grid>
    </Grid>
  );
};
export default File;
