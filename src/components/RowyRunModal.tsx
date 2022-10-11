import { Link } from "react-router-dom";
import { useAtom } from "jotai";

import {
  Typography,
  Button,
  DialogContentText,
  Link as MuiLink,
  Box,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/CheckCircle";

import Modal from "@src/components/Modal";
import MemoizedText from "@src/components/Modal/MemoizedText";
import InlineOpenInNewIcon from "@src/components/InlineOpenInNewIcon";

import {
  projectScope,
  userRolesAtom,
  projectSettingsAtom,
  rowyRunModalAtom,
} from "@src/atoms/projectScope";
import { ROUTES } from "@src/constants/routes";
import { WIKI_LINKS } from "@src/constants/externalLinks";

/**
 * Display a modal asking the user to deploy or upgrade Rowy Run
 * using `rowyRunModalAtom` in `globalState`
 * @see {@link rowyRunModalAtom | Usage example}
 */
export default function RowyRunModal() {
  const [userRoles] = useAtom(userRolesAtom, projectScope);
  const [projectSettings] = useAtom(projectSettingsAtom, projectScope);
  const [rowyRunModal, setRowyRunModal] = useAtom(
    rowyRunModalAtom,
    projectScope
  );

  const handleClose = () => setRowyRunModal({ ...rowyRunModal, open: false });

  const showUpdateModal = rowyRunModal.version && projectSettings?.rowyRunUrl;

  return (
    <Modal
      open={rowyRunModal.open}
      onClose={handleClose}
      title={
        <MemoizedText>
          {rowyRunModal.feature
            ? `${
                showUpdateModal ? "Update" : "Set up"
              } Cloud Functions to use ${rowyRunModal.feature}`
            : `Your Cloud isn’t set up`}
        </MemoizedText>
      }
      maxWidth="xs"
      body={
        <>
          {showUpdateModal && (
            <DialogContentText variant="button" paragraph>
              {rowyRunModal.feature || "This feature"} requires Rowy Run v
              {rowyRunModal.version} or later.
            </DialogContentText>
          )}

          <DialogContentText paragraph>
            Cloud Functions are free to use in our Base plan, you just need to
            set a few things up first. Enable Cloud Functions for:
          </DialogContentText>

          <Box
            component="ol"
            sx={{
              margin: 0,
              padding: 0,
              alignSelf: "stretch",
              "& li": {
                listStyleType: "none",
                display: "flex",
                gap: 1,
                marginBottom: 2,

                "& svg": {
                  display: "flex",
                  fontSize: "1.25rem",
                  color: "action.active",
                },
              },
            }}
          >
            <li>
              <CheckIcon />
              Derivative fields, Extensions, Webhooks
            </li>
            <li>
              <CheckIcon />
              Table and Action scripts
            </li>
            <li>
              <CheckIcon />
              Easy Cloud Function deployment
            </li>
          </Box>

          <MuiLink
            href={WIKI_LINKS.rowyRun}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ display: "flex", mb: 3 }}
          >
            Learn more
            <InlineOpenInNewIcon />
          </MuiLink>

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
            Set up Cloud Functions
          </Button>

          {!userRoles.includes("ADMIN") && (
            <Typography
              variant="body2"
              textAlign="center"
              color="error"
              sx={{ mt: 1 }}
            >
              Only admins can set up Cloud Functions
            </Typography>
          )}
        </>
      }
    />
  );
}
