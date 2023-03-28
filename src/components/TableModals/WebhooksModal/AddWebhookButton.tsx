import { useRef, useState } from "react";

import {
  Button,
  ButtonProps,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EmailIcon from "@mui/icons-material/EmailOutlined";

import { webhookTypes, webhookNames, WebhookType } from "./utils";
import { EMAIL_REQUEST } from "@src/constants/externalLinks";

export interface IAddWebhookButtonProps extends Partial<ButtonProps> {
  handleAddWebhook: (type: WebhookType) => void;
}

export default function AddWebhookButton({
  handleAddWebhook,
  ...props
}: IAddWebhookButtonProps) {
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  const handleChooseAddType = (type: WebhookType) => {
    setOpen(false);
    handleAddWebhook(type);
  };

  return (
    <>
      <Button
        color="primary"
        startIcon={<AddIcon />}
        onClick={() => setOpen(true)}
        ref={addButtonRef}
        sx={{
          alignSelf: { sm: "flex-end" },
          mt: {
            sm: `calc(var(--dialog-title-height) * -1 + (var(--dialog-title-height) - 32px) / 2)`,
          },
          mx: { xs: "var(--dialog-spacing)", sm: undefined },
          mr: { sm: 8 },
          mb: { xs: 1.5, sm: 2 },
        }}
        {...props}
      >
        Add Webhook…
      </Button>

      <Menu
        anchorEl={addButtonRef.current}
        open={open}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {webhookTypes.map((type) => (
          <MenuItem onClick={() => handleChooseAddType(type)}>
            {webhookNames[type]}
          </MenuItem>
        ))}

        <Divider variant="middle" />

        <MenuItem
          component="a"
          href={EMAIL_REQUEST}
          target="_blank"
          rel="noopener noreferrer"
        >
          <ListItemIcon>
            <EmailIcon aria-label="Send email" sx={{ mr: 1.5 }} />
          </ListItemIcon>
          Request new webhook…
        </MenuItem>
      </Menu>
    </>
  );
}
