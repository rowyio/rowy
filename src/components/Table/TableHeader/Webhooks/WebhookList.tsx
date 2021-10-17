import { useState, useRef } from "react";
import { format, formatRelative } from "date-fns";
import CopyIcon from "assets/icons/Copy";

import {
  Stack,
  ButtonBase,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Switch,
  Tooltip,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import WebhookIcon from "assets/icons/Webhook";
import DuplicateIcon from "assets/icons/Copy";
import EditIcon from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";

import EmptyState from "components/EmptyState";
import { webhookTypes, webhookNames, IWebhook, WebhookType } from "./utils";
import { DATE_TIME_FORMAT } from "constants/dates";
import { useProjectContext } from "@src/contexts/ProjectContext";

export interface IWebhookListProps {
  webhooks: IWebhook[];
  handleAddWebhook: (type: WebhookType) => void;
  handleUpdateActive: (index: number, active: boolean) => void;
  handleDuplicate: (index: number) => void;
  handleEdit: (index: number) => void;
  handleDelete: (index: number) => void;
}

export default function WebhookList({
  webhooks,
  handleAddWebhook,
  handleUpdateActive,
  handleDuplicate,
  handleEdit,
  handleDelete,
}: IWebhookListProps) {
  const { settings, tableState } = useProjectContext();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const addButtonRef = useRef(null);

  const activeWebhookCount = webhooks.filter(
    (webhook) => webhook.active
  ).length;

  const handleAddButton = () => {
    setAnchorEl(addButtonRef.current);
  };

  const handleChooseAddType = (type: WebhookType) => {
    handleClose();
    handleAddWebhook(type);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const baseUrl = `${settings?.rowyRunUrl}/whs/${tableState?.tablePath}/`;
  return (
    <>
      <Stack
        direction="row"
        spacing={2}
        justifyContent="space-between"
        alignItems="center"
        style={{ marginTop: 0 }}
      >
        <Typography
          variant="subtitle2"
          component="h2"
          style={{ fontFeatureSettings: "'case', 'tnum'" }}
        >
          Webhooks ({activeWebhookCount} / {webhooks.length})
        </Typography>

        <Button
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddButton}
          ref={addButtonRef}
        >
          Add Webhook…
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          {webhookTypes.map((type) => (
            <MenuItem onClick={() => handleChooseAddType(type)}>
              {webhookNames[type]}
            </MenuItem>
          ))}
        </Menu>
      </Stack>

      {webhooks.length === 0 ? (
        <ButtonBase
          onClick={handleAddButton}
          sx={{
            width: "100%",
            height: 72 * 3,
            borderRadius: 1,
            "&:hover": { bgcolor: "action.hover" },
          }}
        >
          <EmptyState
            message="Add your first webhook"
            description="Your webhooks will appear here."
            Icon={WebhookIcon}
          />
        </ButtonBase>
      ) : (
        <List style={{ paddingTop: 0, minHeight: 72 * 3 }}>
          {webhooks.map((webhook, index) => (
            <ListItem
              disableGutters
              dense={false}
              divider={index !== webhooks.length - 1}
              children={
                <ListItemText
                  primary={
                    <>
                      {webhook.name} <code>{webhookNames[webhook.type]}</code>
                    </>
                  }
                  secondary={
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div
                        style={{
                          maxWidth: 340,
                          overflowX: "auto",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <Typography variant="caption">
                          <code>
                            {baseUrl}
                            {webhook.endpoint}
                          </code>
                        </Typography>
                      </div>
                      <Tooltip title="copy to clipboard">
                        <IconButton
                          onClick={() =>
                            navigator.clipboard.writeText(
                              `${baseUrl}${webhook.endpoint}`
                            )
                          }
                        >
                          <CopyIcon />
                        </IconButton>
                      </Tooltip>
                    </div>
                  }
                  //secondary={webhookNames[webhook.type]}
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
                        onClick={() =>
                          handleUpdateActive(index, !webhook.active)
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
                    <Tooltip title="Edit">
                      <IconButton
                        aria-label="Edit"
                        onClick={() => handleEdit(index)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        aria-label="Delete"
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
                        at{" "}
                        {format(
                          webhook.lastEditor.lastUpdate,
                          DATE_TIME_FORMAT
                        )}
                      </>
                    }
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography
                        variant="body2"
                        sx={{ color: "text.disabled" }}
                      >
                        {formatRelative(
                          webhook.lastEditor.lastUpdate,
                          new Date()
                        )}
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
            />
          ))}
        </List>
      )}
    </>
  );
}
