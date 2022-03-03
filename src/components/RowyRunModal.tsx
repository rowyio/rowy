import { Link } from "react-router-dom";
import { useAtom } from "jotai";
import { rowyRunModalAtom } from "@src/atoms/RowyRunModal";

import {
  Typography,
  Button,
  DialogContentText,
  Link as MuiLink,
} from "@mui/material";

import Modal from "@src/components/Modal";
import Logo from "@src/assets/LogoRowyRun";
import InlineOpenInNewIcon from "@src/components/InlineOpenInNewIcon";

import { useAppContext } from "@src/contexts/AppContext";
import { routes } from "@src/constants/routes";
import { WIKI_LINKS } from "@src/constants/externalLinks";
import { useProjectContext } from "@src/contexts/ProjectContext";

export default function RowyRunModal() {
  const { userClaims } = useAppContext();
  const { settings } = useProjectContext();

  const [state, setState] = useAtom(rowyRunModalAtom);
  const handleClose = () => setState((s) => ({ ...s, open: false }));

  const showUpdateModal = state.version && settings?.rowyRunUrl;

  return (
    <Modal
      open={state.open}
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
            {state.feature || "this feature"}
          </Typography>

          {showUpdateModal && (
            <DialogContentText variant="body1" paragraph textAlign="center">
              {state.feature || "This feature"} requires Rowy Run v
              {state.version} or later.
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
            to={routes.projectSettings + "#rowyRun"}
            variant="contained"
            color="primary"
            size="large"
            onClick={handleClose}
            style={{ display: "flex" }}
            disabled={!userClaims?.roles.includes("ADMIN")}
          >
            Set up Rowy Run
          </Button>

          {!userClaims?.roles.includes("ADMIN") && (
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
