import { ISideDrawerFieldProps } from "@src/components/fields/types";
import { useCallback, useState } from "react";
import { useSetAtom } from "jotai";
import { Controller } from "react-hook-form";

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
} from "@mui/material";
import AddIcon from "@mui/icons-material/AddAPhotoOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import OpenIcon from "@mui/icons-material/OpenInNewOutlined";

import Thumbnail from "@src/components/Thumbnail";
import CircularProgressOptical from "@src/components/CircularProgressOptical";

import { globalScope, confirmDialogAtom } from "@src/atoms/globalScope";
import { tableScope, updateFieldAtom } from "@src/atoms/tableScope";
import { IMAGE_MIME_TYPES } from ".";
import { fieldSx } from "@src/components/SideDrawer/Form/utils";

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

  "$img:hover &": {
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

interface IControlledImageUploaderProps
  extends Pick<ISideDrawerFieldProps, "column" | "docRef" | "disabled"> {
  onChange: (value: any) => void;
  value: any;
}

function ControlledImageUploader({
  onChange,
  value,
  column,
  docRef,
  disabled,
}: IControlledImageUploaderProps) {
  const confirm = useSetAtom(confirmDialogAtom, globalScope);
  const updateField = useSetAtom(updateFieldAtom, tableScope);
  const { uploaderState, upload, deleteUpload } = useUploader();
  const { progress } = uploaderState;

  // Store a preview image locally while uploading
  const [localImage, setLocalImage] = useState<string>("");

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const imageFile = acceptedFiles[0];

      if (docRef && imageFile) {
        upload({
          docRef: docRef as any,
          fieldName: column.key,
          files: [imageFile],
          previousValue: value ?? [],
          onComplete: (newValue) => {
            updateField({
              path: docRef.path,
              fieldName: column.key,
              value: newValue,
            });
            onChange(newValue);
            setLocalImage("");
          },
        });
        setLocalImage(URL.createObjectURL(imageFile));
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
          <input id={`sidedrawer-field-${column.key}`} {...getInputProps()} />
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
                <Tooltip title="Delete…">
                  <div>
                    <ButtonBase
                      sx={imgSx}
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
                        <DeleteIcon color="error" />
                      </Grid>
                    </ButtonBase>
                  </div>
                </Tooltip>
              )}
            </Grid>
          ))}

        {localImage && (
          <Grid item>
            <ButtonBase
              sx={imgSx}
              style={{ backgroundImage: `url("${localImage}")` }}
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

export default function Image_({
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
        <ControlledImageUploader
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
