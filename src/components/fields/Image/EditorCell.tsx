import { useMemo } from "react";
import { IEditorCellProps } from "@src/components/fields/types";
import { useSetAtom } from "jotai";
import { assignIn } from "lodash-es";

import { alpha, Box, Stack, Grid, IconButton, ButtonBase } from "@mui/material";
import AddIcon from "@mui/icons-material/AddAPhotoOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";

import Thumbnail from "@src/components/Thumbnail";
import CircularProgressOptical from "@src/components/CircularProgressOptical";

import { projectScope, confirmDialogAtom } from "@src/atoms/projectScope";
import { FileValue } from "@src/types/table";
import useFileUpload from "@src/components/fields/File/useFileUpload";
import { IMAGE_MIME_TYPES } from "./index";
import { imgSx, thumbnailSx, deleteImgHoverSx } from "./DisplayCell";

export default function Image_({
  column,
  value,
  disabled,
  _rowy_ref,
  tabIndex,
  rowHeight,
  row: { _rowy_arrayTableData },
}: IEditorCellProps) {
  const confirm = useSetAtom(confirmDialogAtom, projectScope);

  const { loading, progress, handleDelete, localFiles, dropzoneState } =
    useFileUpload(
      _rowy_ref,
      column.key,
      {
        multiple: true,
        accept: IMAGE_MIME_TYPES,
      },
      _rowy_arrayTableData
    );

  const localImages = useMemo(
    () =>
      localFiles.map((file) =>
        assignIn(file, { localURL: URL.createObjectURL(file) })
      ),
    [localFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = dropzoneState;
  const dropzoneProps = getRootProps();

  let thumbnailSize = "100x100";
  if (rowHeight > 50) thumbnailSize = "200x200";
  if (rowHeight > 100) thumbnailSize = "400x400";

  return (
    <Stack
      direction="row"
      className="cell-collapse-padding"
      sx={[
        {
          py: 0,
          pl: 1,
          height: "100%",
          width: "100%",
        },
        isDragActive
          ? {
              backgroundColor: (theme) =>
                alpha(
                  theme.palette.primary.main,
                  theme.palette.action.hoverOpacity * 2
                ),

              "& .row-hover-iconButton": { color: "primary.main" },
            }
          : {},
      ]}
      alignItems="center"
      {...dropzoneProps}
      tabIndex={tabIndex}
      onClick={undefined}
    >
      <div
        style={{
          width: `calc(100% - 30px)`,
          overflowX: "hidden",
          marginLeft: "0 !important",
        }}
      >
        <Grid container spacing={0.5} wrap="nowrap">
          {Array.isArray(value) &&
            value.map((file: FileValue, i) => (
              <Grid item key={file.downloadURL}>
                <ButtonBase
                  aria-label="Delete…"
                  sx={imgSx(rowHeight)}
                  className="img"
                  onClick={() => {
                    confirm({
                      title: "Delete image?",
                      body: "This image cannot be recovered after",
                      confirm: "Delete",
                      confirmColor: "error",
                      handleConfirm: () => handleDelete(file),
                    });
                  }}
                  disabled={disabled}
                  tabIndex={tabIndex}
                >
                  <Thumbnail
                    imageUrl={file.downloadURL}
                    size={thumbnailSize}
                    objectFit="contain"
                    sx={thumbnailSx}
                  />
                  <Grid
                    container
                    justifyContent="center"
                    alignItems="center"
                    sx={deleteImgHoverSx}
                  >
                    <DeleteIcon color="error" />
                  </Grid>
                </ButtonBase>
              </Grid>
            ))}

          {localImages &&
            localImages.map((image) => (
              <Grid item>
                <Box
                  sx={[
                    imgSx(rowHeight),
                    {
                      boxShadow: (theme) =>
                        `0 0 0 1px ${theme.palette.divider} inset`,
                    },
                  ]}
                  style={{
                    backgroundImage: `url("${image.localURL}")`,
                  }}
                />
              </Grid>
            ))}
        </Grid>
      </div>

      {!loading ? (
        !disabled && (
          <IconButton
            size="small"
            onClick={(e) => {
              dropzoneProps.onClick!(e);
              e.stopPropagation();
            }}
            style={{ display: "flex" }}
            className={_rowy_ref && "row-hover-iconButton end"}
            disabled={!_rowy_ref}
            tabIndex={tabIndex}
          >
            <AddIcon />
          </IconButton>
        )
      ) : (
        <div style={{ padding: 4 }}>
          <CircularProgressOptical
            size={24}
            variant={progress === 0 ? "indeterminate" : "determinate"}
            value={progress}
            style={{ display: "block" }}
          />
        </div>
      )}

      <input {...getInputProps()} tabIndex={tabIndex} />
    </Stack>
  );
}
