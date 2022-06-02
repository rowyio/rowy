import { useCallback, useState } from "react";
import { ISideDrawerFieldProps } from "@src/components/fields/types";
import { useSetAtom } from "jotai";
import { Controller } from "react-hook-form";
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

import { fieldSx } from "@src/components/SideDrawer/Form/utils";
import { globalScope, confirmDialogAtom } from "@src/atoms/globalScope";
import { tableScope, updateFieldAtom } from "@src/atoms/tableScope";
import { FileValue } from "@src/types/table";

interface IControlledFileUploaderProps
  extends Pick<ISideDrawerFieldProps, "column" | "docRef" | "disabled"> {
  onChange: (value: any) => void;
  value: any;
}

function ControlledFileUploader({
  onChange,

  value,
  column,
  docRef,
  disabled,
}: IControlledFileUploaderProps) {
  const confirm = useSetAtom(confirmDialogAtom, globalScope);
  const updateField = useSetAtom(updateFieldAtom, tableScope);

  const { uploaderState, upload, deleteUpload } = useUploader();

  // Store a preview image locally while uploading
  const [localFile, setLocalFile] = useState<string>("");

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      if (docRef && file) {
        upload({
          docRef: docRef! as any,
          fieldName: column.key,
          files: [file],
          previousValue: value ?? [],
          onComplete: (newValue) => {
            updateField({
              path: docRef.path,
              fieldName: column.key,
              value: newValue,
            });
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
