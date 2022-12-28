import { format, formatRelative } from "date-fns";

import {
  Stack,
  List,
  ListItem,
  ListItemText,
  Avatar,
  IconButton,
  Switch,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  Extension as ExtensionIcon,
  Copy as DuplicateIcon,
  CloudLogs as LogsIcon,
} from "@src/assets/icons";
import EditIcon from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";

import EmptyState from "@src/components/EmptyState";
import { extensionNames, IExtension } from "./utils";
import { DATE_TIME_FORMAT } from "@src/constants/dates";
import { useSetAtom } from "jotai";
import {
  cloudLogFiltersAtom,
  tableModalAtom,
  tableScope,
} from "@src/atoms/tableScope";

export interface IExtensionListProps {
  extensions: IExtension[];
  handleUpdateActive: (index: number, active: boolean) => void;
  handleDuplicate: (index: number) => void;
  handleEdit: (index: number) => void;
  handleDelete: (index: number) => void;
}

export default function ExtensionList({
  extensions,
  handleUpdateActive,
  handleDuplicate,
  handleEdit,
  handleDelete,
}: IExtensionListProps) {
  const setModal = useSetAtom(tableModalAtom, tableScope);
  const setCloudLogFilters = useSetAtom(cloudLogFiltersAtom, tableScope);

  if (extensions.length === 0)
    return (
      <EmptyState
        message="Add your first extension above"
        description="Your extensions will appear here"
        Icon={ExtensionIcon}
        style={{ height: 89 * 3 - 1 }}
      />
    );

  return (
    <List style={{ minHeight: 89 * 3 - 1 }} disablePadding>
      {extensions.map((extensionObject, index) => (
        <ListItem
          disableGutters
          dense={false}
          divider={index !== extensions.length - 1}
          children={
            <ListItemText
              primary={extensionObject.name}
              secondary={extensionNames[extensionObject.type]}
              primaryTypographyProps={{
                style: {
                  minHeight: 40,
                  display: "flex",
                  alignItems: "center",
                },
              }}
            />
          }
          secondaryAction={
            <Stack alignItems="flex-end">
              <Stack direction="row" alignItems="center" spacing={1}>
                <Tooltip
                  title={extensionObject.active ? "Deactivate" : "Activate"}
                >
                  <Switch
                    checked={extensionObject.active}
                    onClick={() =>
                      handleUpdateActive(index, !extensionObject.active)
                    }
                    inputProps={{ "aria-label": "Activate" }}
                    sx={{ mr: 1 }}
                  />
                </Tooltip>

                <Tooltip title="Duplicate">
                  <IconButton
                    aria-label="Duplicate"
                    onClick={() => handleDuplicate(index)}
                  >
                    <DuplicateIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Logs">
                  <IconButton
                    aria-label="Logs"
                    onClick={() => {
                      setModal("cloudLogs");
                      setCloudLogFilters({
                        type: "extension",
                        timeRange: { type: "days", value: 7 },
                        extension: [extensionObject.name],
                      });
                    }}
                  >
                    <LogsIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Edit">
                  <IconButton
                    aria-label="Edit"
                    onClick={() => handleEdit(index)}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete…">
                  <IconButton
                    aria-label="Delete…"
                    color="error"
                    onClick={() => handleDelete(index)}
                    sx={{ "&&": { mr: -1.5 } }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Stack>

              <Tooltip
                title={
                  <>
                    Last updated
                    <br />
                    by {extensionObject.lastEditor.displayName}
                    <br />
                    at{" "}
                    {format(
                      extensionObject.lastEditor.lastUpdate,
                      DATE_TIME_FORMAT
                    )}
                  </>
                }
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="body2" sx={{ color: "text.disabled" }}>
                    {formatRelative(
                      extensionObject.lastEditor.lastUpdate,
                      new Date()
                    )}
                  </Typography>
                  <Avatar
                    alt={`${extensionObject.lastEditor.displayName}’s profile photo`}
                    src={extensionObject.lastEditor.photoURL}
                    sx={{ width: 24, height: 24, "&&": { mr: -0.5 } }}
                  />
                </Stack>
              </Tooltip>
            </Stack>
          }
          sx={{
            flexWrap: { xs: "wrap", sm: "nowrap" },
            "& .MuiListItemSecondaryAction-root": {
              position: { xs: "static", sm: "absolute" },
              width: { xs: "100%", sm: "auto" },
              transform: { xs: "none", sm: "translateY(-50%)" },
            },
            pr: { xs: 0, sm: 216 / 8 },
          }}
        />
      ))}
    </List>
  );
}
