import { useAtom } from "jotai";
import { doc } from "firebase/firestore";
import { ISideDrawerFieldProps } from "@src/components/fields/types";

import { Stack, TextField, IconButton } from "@mui/material";
import LaunchIcon from "@mui/icons-material/Launch";

import { projectScope, projectIdAtom } from "@src/atoms/projectScope";
import { firebaseDbAtom } from "@src/sources/ProjectSourceFirebase";
import { getFieldId } from "@src/components/SideDrawer/utils";

export default function Reference({
  column,
  value,
  onChange,
  onSubmit,
  disabled,
}: ISideDrawerFieldProps) {
  const [projectId] = useAtom(projectIdAtom, projectScope);
  const [firebaseDb] = useAtom(firebaseDbAtom, projectScope);

  const transformedValue =
    Boolean(value) && "path" in value && typeof value.path === "string"
      ? value.path
      : "";

  return (
    <Stack direction="row">
      <TextField
        variant="filled"
        fullWidth
        margin="none"
        onChange={(e) => onChange(doc(firebaseDb, e.target.value))}
        onBlur={onSubmit}
        value={transformedValue}
        id={getFieldId(column.key)}
        label=""
        hiddenLabel
        disabled={disabled}
      />

      <IconButton
        size="small"
        href={`https://console.firebase.google.com/project/${projectId}/firestore/data/~2F${transformedValue.replace(
          /\//g,
          "~2F"
        )}`}
        target="_blank"
        rel="noopener"
        aria-label="Open in Firebase Console"
        disabled={!transformedValue}
        edge="end"
        sx={{ ml: 1 }}
      >
        <LaunchIcon />
      </IconButton>
    </Stack>
  );
}
