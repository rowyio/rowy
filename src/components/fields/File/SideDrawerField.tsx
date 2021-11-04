import { useCallback, useState } from "react";
import { ISideDrawerFieldProps } from "../types";
import clsx from "clsx";
import { Controller } from "react-hook-form";
import { format } from "date-fns";

import { useDropzone } from "react-dropzone";
import useUploader, { FileValue } from "@src/hooks/useTable/useUploader";

import { makeStyles, createStyles } from "@mui/styles";
import {
  alpha,
  ButtonBase,
  Typography,
  Grid,
  Tooltip,
  Chip,
} from "@mui/material";
import UploadIcon from "@src/assets/icons/Upload";
import { FileIcon } from ".";

import Confirmation from "@src/components/Confirmation";
import CircularProgressOptical from "@src/components/CircularProgressOptical";
import { DATE_TIME_FORMAT } from "@src/constants/dates";

import { useFieldStyles } from "@src/components/SideDrawer/Form/utils";
import { useProjectContext } from "@src/contexts/ProjectContext";

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
  })
);

function ControlledFileUploader({
  onChange,

  value,
  column,
  docRef,
  disabled,
}) {
  const classes = useStyles();
  const fieldClasses = useFieldStyles();
  const { updateCell } = useProjectContext();

  const { uploaderState, upload, deleteUpload } = useUploader();
  const {} = uploaderState;

  // Store a preview image locally while uploading
  const [localFile, setLocalFile] = useState<string>("");

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      if (docRef && file) {
        upload({
          docRef,
          fieldName: column.key,
          files: [file],
          previousValue: value ?? [],
          onComplete: (newValue) => {
            if (updateCell) updateCell(docRef, column.key, newValue);
            onChange(newValue);
            setLocalFile("");
          },
        });
        setLocalFile(file.name);
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
            Click to upload or drop file here
          </Typography>
          <UploadIcon sx={{ ml: 1, mr: 2 / 8 }} />
        </ButtonBase>
      )}

      <Grid container spacing={0.5} style={{ marginTop: 2 }}>
        {Array.isArray(value) &&
          value.map((file: FileValue, i) => (
            <Grid item key={file.name}>
              <Tooltip
                title={`File last modified ${format(
                  file.lastModifiedTS,
                  DATE_TIME_FORMAT
                )}`}
              >
                <div>
                  <Confirmation
                    message={{
                      title: "Delete file?",
                      confirm: "Delete",
                    }}
                    functionName={!disabled ? "onDelete" : ""}
                  >
                    <Chip
                      icon={<FileIcon />}
                      label={file.name}
                      onClick={() => window.open(file.downloadURL)}
                      onDelete={!disabled ? () => handleDelete(i) : undefined}
                    />
                  </Confirmation>
                </div>
              </Tooltip>
            </Grid>
          ))}

        {localFile && (
          <Grid item>
            <Chip
              icon={<FileIcon />}
              label={localFile}
              deleteIcon={<CircularProgressOptical size={20} color="inherit" />}
            />
          </Grid>
        )}
      </Grid>
    </>
  );
}

export default function File_({
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
        <ControlledFileUploader
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
