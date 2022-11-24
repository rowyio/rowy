import { IDisplayCellProps } from "@src/components/fields/types";

import { Grid, Chip } from "@mui/material";
import ChipList from "@src/components/Table/TableCell/ChipList";

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
              onClick={(e: any) => e.stopPropagation()}
              component="a"
              href={file.downloadURL}
              target="_blank"
              rel="noopener noreferrer"
              clickable
              style={{ width: "100%", cursor: "pointer" }}
              tabIndex={tabIndex}
            />
          </Grid>
        ))}
    </ChipList>
  );
}
