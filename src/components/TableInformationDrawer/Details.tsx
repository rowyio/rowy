import { useMemo } from "react";
import { format } from "date-fns";
import { find } from "lodash-es";
import MDEditor from "@uiw/react-md-editor";

import { Box, IconButton, Stack, Typography } from "@mui/material";

import EditIcon from "@mui/icons-material/EditOutlined";

import { tableScope, tableSettingsAtom } from "@src/atoms/tableScope";
import { useAtom, useSetAtom } from "jotai";
import {
  projectScope,
  tablesAtom,
  tableSettingsDialogAtom,
  userRolesAtom,
} from "@src/atoms/projectScope";
import { DATE_TIME_FORMAT } from "@src/constants/dates";

export default function Details() {
  const [userRoles] = useAtom(userRolesAtom, projectScope);
  const [tableSettings] = useAtom(tableSettingsAtom, tableScope);
  const [tables] = useAtom(tablesAtom, projectScope);
  const openTableSettingsDialog = useSetAtom(
    tableSettingsDialogAtom,
    projectScope
  );

  const settings = useMemo(
    () => find(tables, ["id", tableSettings.id]),
    [tables, tableSettings.id]
  );

  if (!settings) {
    return null;
  }

  const editButton = userRoles.includes("ADMIN") && (
    <IconButton
      aria-label="Edit"
      onClick={() =>
        openTableSettingsDialog({
          mode: "update",
          data: settings,
        })
      }
      disabled={!openTableSettingsDialog || settings.id.includes("/")}
    >
      <EditIcon />
    </IconButton>
  );

  const { description, details, _createdBy } = settings;

  return (
    <Stack
      direction="column"
      gap={3}
      sx={{
        paddingTop: 3,
        paddingRight: 3,
        paddingBottom: 5,
        "& > .MuiGrid-root": {
          position: "relative",
        },
      }}
    >
      {/* Description */}
      <Stack direction="column" gap={1}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-end"
        >
          <Typography variant="subtitle1" component="h3">
            Description
          </Typography>
          {editButton}
        </Stack>
        <Typography variant="body2" color="text.secondary">
          {description ? description : "No description"}
        </Typography>
      </Stack>

      {/* Details */}
      <Stack direction="column" gap={1}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-end"
        >
          <Typography variant="subtitle1" component="h3">
            Details
          </Typography>
          {editButton}
        </Stack>
        {!details ? (
          <Typography variant="body2" color="text.secondary">
            No details
          </Typography>
        ) : (
          <Box
            sx={{
              color: "text.secondary",
            }}
          >
            <MDEditor.Markdown source={details} />
          </Box>
        )}
      </Stack>

      {/* Table Audits */}
      {_createdBy && (
        <Stack>
          <Typography
            variant="caption"
            color="text.secondary"
            component="div"
            style={{ whiteSpace: "normal" }}
          >
            Created by{" "}
            <Typography variant="caption" color="text.primary">
              {_createdBy.displayName}
            </Typography>{" "}
            on{" "}
            <Typography variant="caption" color="text.primary">
              {format(_createdBy.timestamp.toDate(), DATE_TIME_FORMAT)}
            </Typography>
          </Typography>
        </Stack>
      )}
    </Stack>
  );
}
