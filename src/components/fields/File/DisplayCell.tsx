import { IDisplayCellProps } from "@src/components/fields/types";

import { Grid, Chip } from "@mui/material";
import ChipList from "@src/components/Table/formatters/ChipList";

import { FileIcon } from ".";
import { FileValue } from "@src/types/table";

export default function File_({
  value,
  tabIndex,
  rowHeight,
}: IDisplayCellProps) {
  return (
    <ChipList rowHeight={rowHeight}>
      {Array.isArray(value) &&
        value.map((file: FileValue) => (
          <Grid
            item
            key={file.downloadURL}
            style={
              // Truncate so multiple files still visible
              value.length > 1 ? { maxWidth: `calc(100% - 12px)` } : {}
            }
          >
            <Chip
              icon={<FileIcon />}
              label={file.name}
              onClick={(e) => {
                window.open(file.downloadURL);
                e.stopPropagation();
              }}
              style={{ width: "100%" }}
              tabIndex={tabIndex}
            />
          </Grid>
        ))}
    </ChipList>
  );
}
