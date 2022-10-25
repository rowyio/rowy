import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { IFieldComponentProps } from "@rowy/form-builder";

import { Button, Grid, IconButton, InputLabel, useTheme } from "@mui/material";

import { Upload as UploadImageIcon } from "@src/assets/icons";
import {
  OpenInFull as ExpandIcon,
  CloseFullscreen as CollapseIcon,
  AddPhotoAlternateOutlined as NoImageIcon,
} from "@mui/icons-material";

import { IMAGE_MIME_TYPES } from "@src/components/fields/Image";

export default function TableThumbnail({ ...props }: IFieldComponentProps) {
  const {
    name,
    useFormMethods: { setValue, getValues },
  } = props;

  const theme = useTheme();
  const [localImage, setLocalImage] = useState<string | undefined>(
    () => getValues().thumbnailURL
  );

  const [expanded, setExpanded] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const imageFile = acceptedFiles[0];

      if (imageFile) {
        setLocalImage(URL.createObjectURL(imageFile));
        setValue(name, imageFile);
      }
    },
    [name, setLocalImage, setValue]
  );

  const { getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    accept: IMAGE_MIME_TYPES,
  });

  return (
    <Grid container>
      <Grid
        container
        alignItems="center"
        xs={expanded ? 12 : 10.5}
        sx={{
          marginRight: "auto",
          transition: "all 0.1s",
        }}
      >
        <InputLabel htmlFor="thumbnail-image__input">{props.label}</InputLabel>
        <IconButton
          component="label"
          sx={{
            marginLeft: "auto",
            marginRight: expanded ? 0 : theme.spacing(0.5),
          }}
        >
          <UploadImageIcon />
          <input
            id="thumbnail-image__input"
            type="file"
            hidden
            {...getInputProps()}
          />
        </IconButton>
      </Grid>
      <Grid
        item
        xs={expanded ? 12 : 1.5}
        sx={{
          marginLeft: "auto",
          marginTop: expanded ? theme.spacing(1) : 0,
          transition: "all 0.5s",
        }}
      >
        <Grid
          container
          sx={{
            position: "relative",
            // 16:9 ratio
            paddingBottom: "56.25%",
          }}
        >
          <Button
            disabled={!localImage}
            sx={{
              position: "absolute",
              width: "100%",
              height: "100%",
              backgroundImage: `url("${localImage}")`,
              backgroundSize: "cover",
              backgroundPosition: "center center",
              backgroundRepeat: "no-repeat",
              "& > svg": {
                display: localImage ? "none" : "block",
              },
              "&:hover": {
                opacity: 0.75,
              },
              "&:hover > svg": {
                display: "block",
              },
            }}
            onClick={() => setExpanded(!expanded)}
          >
            {!localImage ? (
              <NoImageIcon />
            ) : expanded ? (
              <CollapseIcon />
            ) : (
              <ExpandIcon />
            )}
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
}
