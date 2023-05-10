import { Suspense } from "react";
import { useAtom } from "jotai";
import { ErrorBoundary } from "react-error-boundary";

import {
  Stack,
  InputLabel,
  Tooltip,
  Typography,
  IconButton,
} from "@mui/material";
import { DocumentPath as DocumentPathIcon } from "@src/assets/icons";
import LaunchIcon from "@mui/icons-material/Launch";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import LockIcon from "@mui/icons-material/LockOutlined";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOffOutlined";

import { InlineErrorFallback } from "@src/components/ErrorFallback";
import FieldSkeleton from "./FieldSkeleton";

import {
  projectScope,
  projectIdAtom,
  altPressAtom,
} from "@src/atoms/projectScope";
import { FieldType } from "@src/constants/fields";
import { getFieldProp } from "@src/components/fields";
import { getLabelId, getFieldId } from "./utils";
import { useSnackbar } from "notistack";
import { copyToClipboard } from "@src/utils/ui";

export interface IFieldWrapperProps {
  children?: React.ReactNode;
  type: FieldType | "debug";
  fieldName?: string;
  label?: React.ReactNode;
  debugText?: React.ReactNode;
  debugValue?: React.ReactNode;
  disabled?: boolean;
  hidden?: boolean;
  index?: number;
}

export default function FieldWrapper({
  children,
  type,
  fieldName,
  label,
  debugText,
  debugValue,
  disabled,
  hidden,
  index,
}: IFieldWrapperProps) {
  const [projectId] = useAtom(projectIdAtom, projectScope);
  const [altPress] = useAtom(altPressAtom, projectScope);
  const { enqueueSnackbar } = useSnackbar();
  return (
    <div>
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{
          color: "text.primary",
          height: 24,
          scrollMarginTop: 24,
          "& svg": {
            display: "block",
            color: "action.active",
            fontSize: `${18 / 16}rem`,
          },
        }}
      >
        {type === "debug" ? <DocumentPathIcon /> : getFieldProp("icon", type)}
        <InputLabel
          id={getLabelId(fieldName!)}
          htmlFor={getFieldId(fieldName!)}
          sx={{ flexGrow: 1, lineHeight: "18px" }}
        >
          {altPress ? <code>{fieldName}</code> : label}
        </InputLabel>

        {hidden && (
          <Tooltip title="Hidden in your table view">
            <VisibilityOffIcon />
          </Tooltip>
        )}
        {disabled && (
          <Tooltip title="Locked by ADMIN">
            <LockIcon />
          </Tooltip>
        )}

        {altPress && (
          <Typography variant="caption" color="text.disabled">
            {index}
          </Typography>
        )}
      </Stack>

      <ErrorBoundary FallbackComponent={InlineErrorFallback}>
        <Suspense fallback={<FieldSkeleton />}>
          {children ??
            (!debugValue && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ paddingLeft: 18 / 8 + 0.75 }}
              >
                This field cannot be edited here.
              </Typography>
            ))}
        </Suspense>
      </ErrorBoundary>

      {debugValue && (
        <Stack direction="row" alignItems="center">
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              flexGrow: 1,
              paddingLeft: 18 / 8 + 1,

              fontFamily: "mono",
              whiteSpace: "normal",
              wordBreak: "break-all",
              userSelect: "all",
            }}
          >
            {debugText}
          </Typography>
          <IconButton
            onClick={() => {
              copyToClipboard(debugValue as string);
              enqueueSnackbar("Copied!");
            }}
          >
            <ContentCopyIcon />
          </IconButton>
          <IconButton
            href={`https://console.firebase.google.com/project/${projectId}/firestore/data/~2F${(
              debugValue as string
            ).replace(/\//g, "~2F")}`}
            target="_blank"
            rel="noopener"
            aria-label="Open in Firebase Console"
            size="small"
            edge="end"
            sx={{ ml: 1 }}
          >
            <LaunchIcon />
          </IconButton>
        </Stack>
      )}
    </div>
  );
}
