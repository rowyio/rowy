import { useSetAtom } from "jotai";
import { format } from "date-fns";

import {
  alpha,
  ButtonBase,
  Typography,
  Grid,
  Tooltip,
  Chip,
} from "@mui/material";
import { Upload as UploadIcon } from "@src/assets/icons";

import { ISideDrawerFieldProps } from "@src/components/fields/types";
import CircularProgressOptical from "@src/components/CircularProgressOptical";
import { DATE_TIME_FORMAT } from "@src/constants/dates";
import { fieldSx, getFieldId } from "@src/components/SideDrawer/utils";
import { projectScope, confirmDialogAtom } from "@src/atoms/projectScope";
import { FileValue } from "@src/types/table";
import useFileUpload from "./useFileUpload";
import { FileIcon } from ".";

export default function File_({
  column,
  _rowy_ref,
  value,
  disabled,
}: ISideDrawerFieldProps) {
  const confirm = useSetAtom(confirmDialogAtom, projectScope);
  const { loading, progress, handleDelete, localFiles, dropzoneState } =
    useFileUpload(_rowy_ref, column.key, { multiple: true });

  const { isDragActive, getRootProps, getInputProps } = dropzoneState;

  return (
    <>
      {!disabled && (
        <ButtonBase
          disabled={loading}
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
          {loading ? (
            <CircularProgressOptical
              size={20}
              variant={progress === 0 ? "indeterminate" : "determinate"}
              value={progress}
            />
          ) : (
            <UploadIcon sx={{ ml: 1, mr: 2 / 8 }} />
          )}
        </ButtonBase>
      )}

      <Grid container spacing={0.5} style={{ marginTop: 2 }}>
        {Array.isArray(value) &&
          value.map((file: FileValue) => (
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
                              handleConfirm: () => handleDelete(file),
                            })
                        : undefined
                    }
                  />
                </div>
              </Tooltip>
            </Grid>
          ))}

        {localFiles &&
          localFiles.map((file) => (
            <Grid item>
              <Chip
                icon={<FileIcon />}
                label={file.name}
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
