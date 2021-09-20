import { useState } from "react";
import { Link } from "react-router-dom";
import MultiSelect from "@rowy/multiselect";

import {
  Button,
  DialogContentText,
  Link as MuiLink,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/PersonAddOutlined";

import Modal from "components/Modal";
import Logo from "assets/Logo";

import { useProjectContext } from "contexts/ProjectContext";
import routes from "constants/routes";
import { runRoutes } from "constants/runRoutes";

export default function InviteUser() {
  const { roles: projectRoles, rowyRun } = useProjectContext();

  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"LOADING" | string>("");

  const [email, setEmail] = useState("");
  const [roles, setRoles] = useState([]);

  const handleInvite = async () => {
    try {
      setStatus("LOADING");
      const res = await rowyRun?.({
        route: runRoutes.inviteUser,
        body: { email, roles },
      });
      if (!res.success) throw new Error(res.message);
    } catch (e: any) {
      console.error(e);
      setStatus("Failed to invite user: " + e.message);
    }
  };

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
              <Logo style={{ marginBottom: "8px", display: "block" }} />

              <DialogContentText paragraph>
                Send an email using Rowy Service to this user, inviting them to
                join your project.
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                placeholder="name@example.com"
                sx={{ mb: 3 }}
              />

              <MultiSelect
                label="Roles"
                value={roles}
                options={Array.isArray(projectRoles) ? projectRoles : ["ADMIN"]}
                onChange={setRoles}
                freeText
                TextFieldProps={{
                  id: "invite-roles",
                  SelectProps: {
                    renderValue: (_) => {
                      if (Array.isArray(roles)) {
                        if (roles.length >= 1) return roles.join(", ");
                        return (
                          <Typography variant="inherit" color="text.disabled">
                            Set roles…
                          </Typography>
                        );
                      }
                    },
                  },
                }}
              />
            </>
          }
          footer={
            status !== "LOADING" &&
            typeof status === "string" && (
              <Typography
                variant="caption"
                color="error"
                textAlign="center"
                sx={{ m: 1, mb: -1 }}
              >
                {status}
              </Typography>
            )
          }
          actions={{
            primary: {
              children: "Invite",
              disabled: !email || roles.length === 0,
              loading: status === "LOADING",
              type: "submit",
              onClick: handleInvite,
            },
          }}
        />
      )}
    </>
  );
}
