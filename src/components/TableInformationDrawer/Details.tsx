import { useMemo, useState } from "react";
import { format } from "date-fns";
import { find } from "lodash-es";
import MDEditor from "@uiw/react-md-editor";

import {
  Box,
  IconButton,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";

import EditIcon from "@mui/icons-material/EditOutlined";
import EditOffIcon from "@mui/icons-material/EditOffOutlined";

import { tableScope, tableSettingsAtom } from "@src/atoms/tableScope";
import { useAtom } from "jotai";
import {
  projectScope,
  tablesAtom,
  updateTableAtom,
  userRolesAtom,
} from "@src/atoms/projectScope";
import { DATE_TIME_FORMAT } from "@src/constants/dates";
import SaveState from "@src/components/SideDrawer/SaveState";

export default function Details() {
  const [userRoles] = useAtom(userRolesAtom, projectScope);
  const [tableSettings] = useAtom(tableSettingsAtom, tableScope);
  const [tables] = useAtom(tablesAtom, projectScope);
  const [updateTable] = useAtom(updateTableAtom, projectScope);
  const theme = useTheme();

  const settings = useMemo(
    () => find(tables, ["id", tableSettings.id]),
    [tables, tableSettings.id]
  );

  const { description, details, _createdBy } = settings ?? {};

  const [editDescription, setEditDescription] = useState(false);
  const [localDescription, setLocalDescription] = useState(description ?? "");
  const [localDetails, setLocalDetails] = useState(details ?? "");
  const [editDetails, setEditDetails] = useState(false);

  const [saveState, setSaveState] = useState<
    "" | "unsaved" | "saving" | "saved"
  >("");

  if (!settings) {
    return null;
  }

  const handleSave = async () => {
    setSaveState("saving");
    await updateTable!({
      ...settings,
      description: localDescription,
      details: localDetails,
    });
    setSaveState("saved");
  };

  const isAdmin = userRoles.includes("ADMIN");

  return (
    <>
      <Box
        sx={{
          paddingTop: 3,
          paddingRight: 4,
          position: "fixed",
          right: 0,
          zIndex: 1,
        }}
      >
        <SaveState state={saveState} />
      </Box>
      <Stack
        gap={3}
        sx={{
          paddingTop: 3,
          paddingRight: 3,
          paddingBottom: 5,
        }}
      >
        {/* Description */}
        <Stack gap={1}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-end"
          >
            <Typography variant="subtitle1" component="h3">
              Description
            </Typography>
            {isAdmin && (
              <IconButton
                aria-label="Edit description"
                onClick={() => {
                  setEditDescription(!editDescription);
                }}
                sx={{ top: 4 }}
              >
                {editDescription ? <EditOffIcon /> : <EditIcon />}
              </IconButton>
            )}
          </Stack>
          {editDescription ? (
            <TextField
              sx={{
                color: "text.secondary",
              }}
              value={localDescription}
              onChange={(e) => {
                setLocalDescription(e.target.value);
                setSaveState("unsaved");
              }}
              onBlur={() => handleSave()}
              rows={2}
              minRows={2}
            />
          ) : (
            <Typography variant="body2" color="text.secondary">
              {localDescription ? localDescription : "No description"}
            </Typography>
          )}
        </Stack>
        {/* Details */}
        <Stack gap={1}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-end"
          >
            <Typography variant="subtitle1" component="h3">
              Details
            </Typography>
            {isAdmin && (
              <IconButton
                aria-label="Edit details"
                onClick={() => {
                  setEditDetails(!editDetails);
                }}
                sx={{ top: 4 }}
              >
                {editDetails ? <EditOffIcon /> : <EditIcon />}
              </IconButton>
            )}
          </Stack>
          <Box
            sx={{
              color: "text.secondary",
              fontSize: `${theme.typography.body2.fontSize} !important`,
              "& .w-md-editor": {
                backgroundColor: `${theme.palette.action.input} !important`,
              },
              "& .w-md-editor-fullscreen": {
                backgroundColor: `${theme.palette.background.paper} !important`,
              },
            }}
          >
            {editDetails ? (
              <MDEditor
                style={{ margin: 1 }}
                toolbarHeight={58}
                value={localDetails}
                textareaProps={{
                  onChange: (e) => {
                    setLocalDetails(e.target.value ?? "");
                    setSaveState("unsaved");
                  },
                  onBlur: () => handleSave(),
                }}
              />
            ) : !localDetails ? (
              <Typography variant="body2">No details</Typography>
            ) : (
              <MDEditor.Markdown source={localDetails} />
            )}
          </Box>
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
    </>
  );
}
