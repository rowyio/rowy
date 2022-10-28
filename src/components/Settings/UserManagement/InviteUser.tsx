import { useState } from "react";
import { useAtom, useSetAtom } from "jotai";
import { Link } from "react-router-dom";
import { useSnackbar } from "notistack";

import {
  Button,
  DialogContentText,
  Link as MuiLink,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/PersonAddOutlined";

import MultiSelect from "@rowy/multiselect";
import Modal from "@src/components/Modal";

import {
  projectScope,
  projectRolesAtom,
  projectSettingsAtom,
  rowyRunAtom,
  rowyRunModalAtom,
} from "@src/atoms/projectScope";
import { ROUTES } from "@src/constants/routes";
import { runRoutes } from "@src/constants/runRoutes";

export default function InviteUser() {
  const [projectRoles] = useAtom(projectRolesAtom, projectScope);
  const [projectSettings] = useAtom(projectSettingsAtom, projectScope);
  const [rowyRun] = useAtom(rowyRunAtom, projectScope);
  const openRowyRunModal = useSetAtom(rowyRunModalAtom, projectScope);
  const { enqueueSnackbar } = useSnackbar();

  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"LOADING" | string>("");

  const [email, setEmail] = useState("");
  const [roles, setRoles] = useState([]);

  const handleInvite = async () => {
    try {
      setStatus("LOADING");
      const res = await rowyRun({
        route: runRoutes.inviteUser,
        body: { email, roles },
      });
      if (!res.success) throw new Error(res.message);
      setStatus("");
      setOpen(false);
      enqueueSnackbar(`Sent invite to: ${email}`);
    } catch (e: any) {
      console.error(e);
      setStatus("Failed to invite user: " + e.message);
    }
  };

  return (
    <>
      <Button
        aria-label="Invite user"
        onClick={
          projectSettings.rowyRunUrl
            ? () => setOpen(true)
            : () => openRowyRunModal({ feature: "Invite user" })
        }
        variant="text"
        color="primary"
        startIcon={<AddIcon />}
        sx={{ "&&": { mb: -0.5 } }}
      >
        Invite user
      </Button>

      {open && (
        <Modal
          title="Invite user"
          onClose={() => setOpen(false)}
          maxWidth="xs"
          body={
            <>
              <DialogContentText paragraph>
                Invite a user to join your project via email.
              </DialogContentText>
              <DialogContentText>
                They can sign up with any of the sign-in options{" "}
                <MuiLink
                  component={Link}
                  to={ROUTES.projectSettings + "#authentication"}
                >
                  you have enabled
                </MuiLink>
                , as long as they use the same email address.
              </DialogContentText>

              <TextField
                label="Email address"
                id="invite-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                placeholder="name@example.com"
                sx={{ mt: 3 }}
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
                    renderValue: () => {
                      if (Array.isArray(roles)) {
                        if (roles.length >= 1) return roles.join(", ");
                        return (
                          <Typography variant="inherit" color="text.disabled">
                            Set roles…
                          </Typography>
                        );
                      }
                      return null;
                    },
                  },
                  sx: { mt: 3 },
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
