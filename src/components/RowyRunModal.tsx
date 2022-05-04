import { Link } from "react-router-dom";
import { useAtom } from "jotai";

import {
  Typography,
  Button,
  DialogContentText,
  Link as MuiLink,
} from "@mui/material";

import Modal from "@src/components/Modal";
import Logo from "@src/assets/LogoRowyRun";
import InlineOpenInNewIcon from "@src/components/InlineOpenInNewIcon";

import {
  globalScope,
  userRolesAtom,
  projectSettingsAtom,
  rowyRunModalAtom,
} from "@src/atoms/globalScope";
import { ROUTES } from "@src/constants/routes";
import { WIKI_LINKS } from "@src/constants/externalLinks";

/**
 * Display a modal asking the user to deploy or upgrade Rowy Run
 * using `rowyRunModalAtom` in `globalState`
 * {@link rowyRunModalAtom | See usage example}
 */
export default function RowyRunModal() {
  const [userRoles] = useAtom(userRolesAtom, globalScope);
  const [projectSettings] = useAtom(projectSettingsAtom, globalScope);
  const [rowyRunModal, setRowyRunModal] = useAtom(
    rowyRunModalAtom,
    globalScope
  );

  const handleClose = () => setRowyRunModal({ ...rowyRunModal, open: false });

  const showUpdateModal = rowyRunModal.version && projectSettings?.rowyRunUrl;

  return (
    <Modal
      open={rowyRunModal.open}
      onClose={handleClose}
      title={
        <Logo
          size={2}
          style={{
            margin: "16px auto",
            display: "block",
            position: "relative",
            right: 44 / -2,
          }}
        />
      }
      maxWidth="xs"
      body={
        <>
          <Typography variant="h5" paragraph align="center">
            {showUpdateModal ? "Update" : "Set up"} Rowy Run to use{" "}
            {rowyRunModal.feature || "this feature"}
          </Typography>

          {showUpdateModal && (
            <DialogContentText variant="body1" paragraph textAlign="center">
              {rowyRunModal.feature || "This feature"} requires Rowy Run v
              {rowyRunModal.version} or later.
            </DialogContentText>
          )}

          <DialogContentText variant="body1" paragraph textAlign="center">
            Rowy Run is a Cloud Run instance that provides backend
            functionality, such as table action scripts, user management, and
            easy Cloud Function deployment.{" "}
            <MuiLink
              href={WIKI_LINKS.rowyRun}
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn more
              <InlineOpenInNewIcon />
            </MuiLink>
          </DialogContentText>

          <Button
            component={Link}
            to={ROUTES.projectSettings + "#rowyRun"}
            variant="contained"
            color="primary"
            size="large"
            onClick={handleClose}
            style={{ display: "flex" }}
            disabled={!userRoles.includes("ADMIN")}
          >
            Set up Rowy Run
          </Button>

          {!userRoles.includes("ADMIN") && (
            <Typography
              variant="body2"
              textAlign="center"
              color="error"
              sx={{ mt: 1 }}
            >
              Contact the project owner to set up Rowy&nbsp;Run
            </Typography>
          )}
        </>
      }
    />
  );
}
