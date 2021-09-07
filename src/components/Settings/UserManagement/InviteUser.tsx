import { useState } from "react";
import { Link } from "react-router-dom";

import {
  Button,
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
      <Button
        aria-label="Invite User"
        onClick={() => setOpen(true)}
        variant="text"
        color="primary"
        startIcon={<AddIcon />}
        sx={{ "&&": { mb: -0.5 } }}
      >
        Invite User
      </Button>

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
