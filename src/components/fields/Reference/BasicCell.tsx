import { useAtom } from "jotai";
import { IBasicCellProps } from "@src/components/fields/types";

import { Stack, IconButton } from "@mui/material";
import LaunchIcon from "@mui/icons-material/Launch";

import { projectScope, projectIdAtom } from "@src/atoms/projectScope";

export default function Reference({ value }: IBasicCellProps) {
  const [projectId] = useAtom(projectIdAtom, projectScope);

  const path = value?.path ?? "";
  if (!path) return null;

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      className="cell-collapse-padding"
      sx={{ p: "var(--cell-padding)", pr: 0.5 }}
    >
      <div style={{ flexGrow: 1, overflow: "hidden" }}>{path}</div>

      <IconButton
        size="small"
        href={`https://console.firebase.google.com/project/${projectId}/firestore/data/~2F${path.replace(
          /\//g,
          "~2F"
        )}`}
        target="_blank"
        rel="noopener"
        aria-label="Open in Firebase Console"
        className="row-hover-iconButton"
        style={{ flexShrink: 0 }}
      >
        <LaunchIcon />
      </IconButton>
    </Stack>
  );
}
