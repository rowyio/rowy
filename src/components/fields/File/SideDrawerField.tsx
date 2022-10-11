import { useCallback, useState } from "react";
import { ISideDrawerFieldProps } from "@src/components/fields/types";
import { useSetAtom } from "jotai";
import { format } from "date-fns";

import { useDropzone } from "react-dropzone";
import useUploader from "@src/hooks/useFirebaseStorageUploader";

import {
  alpha,
  ButtonBase,
  Typography,
  Grid,
  Tooltip,
  Chip,
} from "@mui/material";
import { Upload as UploadIcon } from "@src/assets/icons";
import { FileIcon } from ".";

import CircularProgressOptical from "@src/components/CircularProgressOptical";
import { DATE_TIME_FORMAT } from "@src/constants/dates";

import { fieldSx, getFieldId } from "@src/components/SideDrawer/utils";
import { projectScope, confirmDialogAtom } from "@src/atoms/projectScope";
import { FileValue } from "@src/types/table";
import { arrayUnion } from "firebase/firestore";

export default function File_({
  column,
  _rowy_ref,
  value,
  onChange,
  onSubmit,
  disabled,
}: ISideDrawerFieldProps) {
  const confirm = useSetAtom(confirmDialogAtom, projectScope);

  const { uploaderState, upload, deleteUpload } = useUploader();

  // Store a preview image locally while uploading
  const [localFiles, setLocalFiles] = useState<string[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        upload({
          docRef: _rowy_ref! as any,
          fieldName: column.key,
          files: acceptedFiles,
          onComplete: (newUploads) => {
            onChange(arrayUnion(newUploads));
            onSubmit();
            setLocalFiles([]);
          },
        });
        setLocalFiles(acceptedFiles.map((file) => file.name));
      }
    },
    [_rowy_ref, value]
  );

  const handleDelete = (index: number) => {
    const newValue = [...value];
    const toBeDeleted = newValue.splice(index, 1);
    toBeDeleted.length && deleteUpload(toBeDeleted[0]);
    onChange(newValue);
    onSubmit();
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  });

  return (
    <>
      {!disabled && (
        <ButtonBase
          sx={[
            fieldSx,
            {
              justifyContent: "flex-start",
              color: "text.secondary",
            },
            isDragActive
              ? {
                  backgroundColor: (theme) =>
                    alpha(
                      theme.palette.primary.light,
                      theme.palette.action.hoverOpacity * 2
                    ),
                  color: "primary.main",
                }
              : {},
          ]}
          {...getRootProps()}
        >
          <input id={getFieldId(column.key)} {...getInputProps()} />
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
                  <Chip
                    icon={<FileIcon />}
                    label={file.name}
                    onClick={() => window.open(file.downloadURL)}
                    onDelete={
                      !disabled
                        ? () =>
                            confirm({
                              title: "Delete file?",
                              body: "This file cannot be recovered after",
                              confirm: "Delete",
                              confirmColor: "error",
                              handleConfirm: () => handleDelete(i),
                            })
                        : undefined
                    }
                  />
                </div>
              </Tooltip>
            </Grid>
          ))}

        {localFiles &&
          localFiles.map((fileName) => (
            <Grid item>
              <Chip
                icon={<FileIcon />}
                label={fileName}
                deleteIcon={
                  <CircularProgressOptical size={20} color="inherit" />
                }
              />
            </Grid>
          ))}
      </Grid>
    </>
  );
}
