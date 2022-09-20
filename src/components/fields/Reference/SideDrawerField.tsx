import { useState } from "react";
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

  const [localValue, setLocalValue] = useState(
    Boolean(value) && "path" in value && typeof value.path === "string"
      ? value.path
      : ""
  );
  const [error, setError] = useState("");

  return (
    <Stack direction="row" alignItems="flex-start">
      <TextField
        variant="filled"
        fullWidth
        margin="none"
        onChange={(e) => {
          try {
            doc(firebaseDb, e.target.value);
            setError("");
          } catch (e: any) {
            setError(e.message);
          }
          setLocalValue(e.target.value);
        }}
        onBlur={() => {
          if (!error) {
            onChange(doc(firebaseDb, localValue));
            onSubmit();
          }
        }}
        value={localValue}
        error={Boolean(error)}
        helperText={error}
        id={getFieldId(column.key)}
        label=""
        hiddenLabel
        disabled={disabled}
      />

      <IconButton
        size="small"
        href={`https://console.firebase.google.com/project/${projectId}/firestore/data/~2F${localValue.replace(
          /\//g,
          "~2F"
        )}`}
        target="_blank"
        rel="noopener"
        aria-label="Open in Firebase Console"
        disabled={Boolean(error) || !localValue}
        edge="end"
        sx={{ ml: 1 }}
      >
        <LaunchIcon />
      </IconButton>
    </Stack>
  );
}
