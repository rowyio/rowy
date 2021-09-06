import { useState } from "react";
import { Link } from "react-router-dom";

import {
  Tooltip,
  Zoom,
  Fab,
  DialogContentText,
  Link as MuiLink,
  TextField,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/PersonAddOutlined";

import Modal from "components/Modal";

import routes from "constants/routes";

export default function InviteUser() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Tooltip title="Invite User">
        <Zoom in>
          <Fab
            aria-label="Invite User"
            onClick={() => setOpen(true)}
            color="secondary"
            sx={{
              zIndex: "speedDial",
              position: "fixed",
              bottom: (theme) => ({
                xs: theme.spacing(2),
                sm: theme.spacing(3),
              }),
              right: (theme) => ({
                xs: theme.spacing(2),
                sm: theme.spacing(3),
              }),
            }}
          >
            <AddIcon />
          </Fab>
        </Zoom>
      </Tooltip>

      {open && (
        <Modal
          title="Invite User"
          onClose={() => setOpen(false)}
          maxWidth="xs"
          body={
            <>
              <DialogContentText paragraph>
                Send an email to this user to invite them to join your project.
              </DialogContentText>
              <DialogContentText paragraph>
                They can sign up with any of the sign-in options{" "}
                <MuiLink
                  component={Link}
                  to={routes.projectSettings + "#authentication"}
                >
                  you have enabled
                </MuiLink>
                , as long as they use the same email address.
              </DialogContentText>
              <TextField
                label="Email Address"
                id="invite-email"
                fullWidth
                autoFocus
                placeholder="name@example.com"
              />
            </>
          }
          actions={{ primary: { children: "Invite" } }}
        />
      )}
    </>
  );
}
