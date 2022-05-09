import { IBasicCellProps } from "../types";
import { Stack, IconButton } from "@mui/material";
import LaunchIcon from "@mui/icons-material/Launch";
import { useAppContext } from "@src/contexts/AppContext";
export default function Reference({ value }: IBasicCellProps) {
  const { projectId } = useAppContext();
  if (!value) return <></>;
  const { path } = value;
  return path ? (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      className="cell-collapse-padding"
      sx={{ p: "var(--cell-padding)", pr: 0.5 }}
    >
      <div style={{ flexGrow: 1, overflow: "hidden" }}>{path}</div>
      <IconButton
        href={`https://console.firebase.google.com/u/0/project/${projectId}/firestore/data/~2F${encodeURIComponent(
          path
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="row-hover-iconButton"
        size="small"
        style={{ flexShrink: 0 }}
      >
        <LaunchIcon />
      </IconButton>
    </Stack>
  ) : (
    <>Not Valid Ref</>
  );
}
