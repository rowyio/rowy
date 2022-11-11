import { ISideDrawerFieldProps } from "@src/components/fields/types";
import { useCallback, useState } from "react";
import { useSetAtom } from "jotai";

import { useDropzone } from "react-dropzone";
// TODO: GENERALIZE
import useUploader from "@src/hooks/useFirebaseStorageUploader";

import {
  alpha,
  ButtonBase,
  Typography,
  Grid,
  Tooltip,
  Theme,
  IconButton,
  Box,
} from "@mui/material";
import AddIcon from "@mui/icons-material/AddAPhotoOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import OpenIcon from "@mui/icons-material/OpenInNewOutlined";

import Thumbnail from "@src/components/Thumbnail";
import CircularProgressOptical from "@src/components/CircularProgressOptical";

import { projectScope, confirmDialogAtom } from "@src/atoms/projectScope";
import { IMAGE_MIME_TYPES } from ".";
import { fieldSx, getFieldId } from "@src/components/SideDrawer/utils";

const imgSx = {
  position: "relative",
  width: 80,
  height: 80,
  borderRadius: 1,
  // boxShadow: `0 0 0 1px ${theme.palette.divider} inset`,

  backgroundSize: "contain",
  backgroundPosition: "center center",
  backgroundRepeat: "no-repeat",
};
const thumbnailSx = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
};
const overlaySx = {
  position: "absolute",
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,

  backgroundColor: (theme: Theme) => alpha(theme.palette.background.paper, 0.8),
  color: "text.secondary",
  boxShadow: (theme: Theme) => `0 0 0 1px ${theme.palette.divider} inset`,
  borderRadius: 1,
};
const deleteImgHoverSx = {
  transition: (theme: Theme) =>
    theme.transitions.create("background-color", {
      duration: theme.transitions.duration.shortest,
    }),

  backgroundColor: "transparent",

  ".img:hover &": {
    backgroundColor: (theme: Theme) =>
      alpha(theme.palette.background.paper, 0.8),
    "& *": { opacity: 1 },
  },

  "& *": {
    opacity: 0,
    transition: (theme: Theme) =>
      theme.transitions.create("opacity", {
        duration: theme.transitions.duration.shortest,
      }),
  },
};

export default function Image_({
  column,
  _rowy_ref,
  value,
  onChange,
  onSubmit,
  disabled,
}: ISideDrawerFieldProps) {
  const confirm = useSetAtom(confirmDialogAtom, projectScope);
  const { uploaderState, upload, deleteUpload } = useUploader();
  const { progress } = uploaderState;

  // Store a preview image locally while uploading
  const [localImage, setLocalImage] = useState<string>("");

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const imageFile = acceptedFiles[0];

      if (_rowy_ref && imageFile) {
        upload({
          docRef: _rowy_ref! as any,
          fieldName: column.key,
          files: [imageFile],
          previousValue: value ?? [],
          onComplete: (newValue) => {
            onChange(newValue);
            onSubmit();
            setLocalImage("");
          },
        });
        setLocalImage(URL.createObjectURL(imageFile));
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
    multiple: false,
    accept: IMAGE_MIME_TYPES,
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
            {isDragActive
              ? "Drop image here"
              : "Click to upload or drop image here"}
          </Typography>
          <AddIcon sx={{ ml: 1, mr: 2 / 8 }} />
        </ButtonBase>
      )}

      <Grid container spacing={1} style={{ marginTop: 0 }}>
        {Array.isArray(value) &&
          value.map((image, i) => (
            <Grid item key={image.downloadURL}>
              {disabled ? (
                <Tooltip title="Open">
                  <ButtonBase
                    sx={imgSx}
                    onClick={() => window.open(image.downloadURL, "_blank")}
                    className="img"
                  >
                    <Thumbnail
                      imageUrl={image.downloadURL}
                      size="200x200"
                      objectFit="contain"
                      sx={thumbnailSx}
                    />
                    <Grid
                      container
                      justifyContent="center"
                      alignItems="center"
                      sx={[overlaySx, deleteImgHoverSx]}
                    >
                      {disabled ? <OpenIcon /> : <DeleteIcon color="error" />}
                    </Grid>
                  </ButtonBase>
                </Tooltip>
              ) : (
                <div>
                  <Box sx={imgSx} className="img">
                    <Thumbnail
                      imageUrl={image.downloadURL}
                      size="200x200"
                      objectFit="contain"
                      sx={thumbnailSx}
                    />
                    <Grid
                      container
                      justifyContent="center"
                      alignItems="center"
                      sx={[overlaySx, deleteImgHoverSx]}
                    >
                      <Tooltip title="Delete…">
                        <IconButton
                          onClick={() =>
                            confirm({
                              title: "Delete image?",
                              body: "This image cannot be recovered after",
                              confirm: "Delete",
                              confirmColor: "error",
                              handleConfirm: () => handleDelete(i),
                            })
                          }
                        >
                          <DeleteIcon color="error" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Open">
                        <IconButton
                          onClick={() =>
                            window.open(image.downloadURL, "_blank")
                          }
                        >
                          <OpenIcon />
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  </Box>
                </div>
              )}
            </Grid>
          ))}

        {localImage && (
          <Grid item>
            <ButtonBase
              sx={imgSx}
              style={{ backgroundImage: `url("${localImage}")` }}
              className="img"
            >
              <Grid
                container
                justifyContent="center"
                alignItems="center"
                sx={overlaySx}
              >
                <CircularProgressOptical
                  color="inherit"
                  size={48}
                  variant={progress === 0 ? "indeterminate" : "determinate"}
                  value={progress}
                />
              </Grid>
            </ButtonBase>
          </Grid>
        )}
      </Grid>
    </>
  );
}
