import { IDisplayCellProps } from "@src/components/fields/types";
import { useAtom } from "jotai";

import { alpha, Theme, Stack, Grid, ButtonBase } from "@mui/material";
import OpenIcon from "@mui/icons-material/OpenInNewOutlined";

import Thumbnail from "@src/components/Thumbnail";

import { tableSchemaAtom, tableScope } from "@src/atoms/tableScope";
import { DEFAULT_ROW_HEIGHT } from "@src/components/Table";
import { FileValue } from "@src/types/table";

// MULTIPLE
export const imgSx = (rowHeight: number) => ({
  position: "relative",
  display: "flex",

  width: (theme: Theme) => `calc(${rowHeight}px - ${theme.spacing(1)} - 1px)`,
  height: (theme: Theme) => `calc(${rowHeight}px - ${theme.spacing(1)} - 1px)`,

  backgroundSize: "contain",
  backgroundPosition: "center center",
  backgroundRepeat: "no-repeat",

  borderRadius: 1,
});
export const thumbnailSx = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
};
export const deleteImgHoverSx = {
  position: "absolute",
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,

  color: "text.secondary",
  boxShadow: (theme: Theme) => `0 0 0 1px ${theme.palette.divider} inset`,
  borderRadius: 1,

  transition: (theme: Theme) =>
    theme.transitions.create("background-color", {
      duration: theme.transitions.duration.shortest,
    }),

  "& *": {
    opacity: 0,
    transition: (theme: Theme) =>
      theme.transitions.create("opacity", {
        duration: theme.transitions.duration.shortest,
      }),
  },

  ".img:hover &, .img:focus &": {
    backgroundColor: (theme: Theme) =>
      alpha(theme.palette.background.paper, 0.8),
    "& *": { opacity: 1 },
  },
};

export default function Image_({ value, tabIndex }: IDisplayCellProps) {
  const [tableSchema] = useAtom(tableSchemaAtom, tableScope);

  const rowHeight = tableSchema.rowHeight ?? DEFAULT_ROW_HEIGHT;
  let thumbnailSize = "100x100";
  if (rowHeight > 50) thumbnailSize = "200x200";
  if (rowHeight > 100) thumbnailSize = "400x400";

  return (
    <Stack
      direction="row"
      sx={[{ py: 0, pl: 1, height: "100%" }]}
      alignItems="center"
    >
      <Grid container spacing={0.5} wrap="nowrap">
        {Array.isArray(value) &&
          value.map((file: FileValue, i) => (
            <Grid item key={file.downloadURL}>
              {
                <ButtonBase
                  aria-label="Open"
                  sx={imgSx(rowHeight)}
                  className="img"
                  onClick={() => window.open(file.downloadURL, "_blank")}
                  tabIndex={tabIndex}
                >
                  <Thumbnail
                    imageUrl={file.downloadURL}
                    size={thumbnailSize}
                    objectFit="contain"
                    sx={thumbnailSx}
                    tabIndex={tabIndex}
                  />
                  <Grid
                    container
                    justifyContent="center"
                    alignItems="center"
                    sx={deleteImgHoverSx}
                  >
                    <OpenIcon />
                  </Grid>
                </ButtonBase>
              }
            </Grid>
          ))}
      </Grid>
    </Stack>
  );
}
