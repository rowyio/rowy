import { useAtom, useSetAtom } from "jotai";
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
import WebhookIcon from "@mui/icons-material/Webhook";
import { CloudLogs as LogsIcon } from "@src/assets/icons";
import EditIcon from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import LinkIcon from "@mui/icons-material/Link";

import EmptyState from "@src/components/EmptyState";

import { webhookNames, IWebhook } from "./utils";
import { DATE_TIME_FORMAT } from "@src/constants/dates";
import { projectScope, projectSettingsAtom } from "@src/atoms/projectScope";
import {
  tableScope,
  tableSettingsAtom,
  tableModalAtom,
  cloudLogFiltersAtom,
} from "@src/atoms/tableScope";

export interface IWebhookListProps {
  webhooks: IWebhook[];
  handleUpdateActive: (index: number, active: boolean) => void;
  handleEdit: (index: number) => void;
  handleDelete: (index: number) => void;
}

export default function WebhookList({
  webhooks,
  handleUpdateActive,
  handleEdit,
  handleDelete,
}: IWebhookListProps) {
  const [projectSettings] = useAtom(projectSettingsAtom, projectScope);
  const [tableSettings] = useAtom(tableSettingsAtom, tableScope);
  const setModal = useSetAtom(tableModalAtom, tableScope);
  const setCloudLogFilters = useSetAtom(cloudLogFiltersAtom, tableScope);

  const baseUrl = `${projectSettings.services?.hooks}/wh/${tableSettings.collection}/`;

  if (webhooks.length === 0)
    return (
      <EmptyState
        message="Add your first webhook above"
        description="Your webhooks will appear here"
        Icon={WebhookIcon}
        style={{ height: 89 * 3 - 1 }}
      />
    );

  return (
    <List style={{ paddingTop: 0, minHeight: 89 * 3 - 1 }} disablePadding>
      {webhooks.map((webhook, index) => (
        <ListItem
          disableGutters
          dense={false}
          divider={index !== webhooks.length - 1}
          children={
            <ListItemText
              primary={webhook.name}
              secondary={
                <>
                  {webhookNames[webhook.type]}{" "}
                  <code
                    style={{
                      userSelect: "all",
                      paddingRight: 0,
                    }}
                  >
                    <Tooltip title="Endpoint ID">
                      <span>{webhook.endpoint}</span>
                    </Tooltip>
                    <Tooltip title="Copy endpoint URL">
                      <IconButton
                        onClick={() =>
                          navigator.clipboard.writeText(
                            baseUrl + webhook.endpoint
                          )
                        }
                        size="small"
                        color="secondary"
                        sx={{ my: (20 - 32) / 2 / 8 }}
                      >
                        <LinkIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </code>
                </>
              }
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
                <Tooltip title={webhook.active ? "Deactivate" : "Activate"}>
                  <Switch
                    checked={webhook.active}
                    onClick={() => handleUpdateActive(index, !webhook.active)}
                    inputProps={{ "aria-label": "Activate" }}
                    sx={{ mr: 1 }}
                  />
                </Tooltip>

                <Tooltip title="Logs">
                  <IconButton
                    aria-label="Logs"
                    onClick={() => {
                      setModal("cloudLogs");
                      setCloudLogFilters({
                        type: "webhook",
                        timeRange: { type: "days", value: 7 },
                        webhook: [webhook.endpoint],
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
                    by {webhook.lastEditor.displayName}
                    <br />
                    at {format(webhook.lastEditor.lastUpdate, DATE_TIME_FORMAT)}
                  </>
                }
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="body2" sx={{ color: "text.disabled" }}>
                    {formatRelative(webhook.lastEditor.lastUpdate, new Date())}
                  </Typography>
                  <Avatar
                    alt={`${webhook.lastEditor.displayName}’s profile photo`}
                    src={webhook.lastEditor.photoURL}
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
