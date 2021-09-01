import useDoc from "hooks/useDoc";
import Modal from "components/Modal";
import { Box, Button, CircularProgress, Typography } from "@material-ui/core";
import { IFormDialogProps } from "./Table/ColumnMenu/NewColumn";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";

export interface IProjectSettings
  extends Pick<IFormDialogProps, "handleClose"> {}

export default function BuilderInstaller({ handleClose }: IProjectSettings) {
  const [settingsState] = useDoc({
    path: "_rowy_/settings",
  });

  if (settingsState.loading) return null;

  const complete =
    settingsState.doc.buildStatus === "COMPLETE" ||
    !!settingsState.doc.buildUrl;
  const building = settingsState.doc.buildStatus === "BUILDING";
  const waiting = !settingsState.doc.buildStatus && !settingsState.doc.buildUrl;

  return (
    <Modal
      onClose={handleClose}
      title="One Click Builder Installer"
      maxWidth="sm"
      children={
        <Box display="flex" flexDirection="column">
          <Typography variant="body2">
            You will be redirected to Google Cloud Shell to deploy Rowy Function
            Builder to Cloud Run.
          </Typography>
          <br />

          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
          >
            {complete && (
              <>
                <CheckCircleIcon />
                <Typography variant="overline">Deploy Complete</Typography>
              </>
            )}
            {building && (
              <>
                <CircularProgress size={25} />
                <Typography variant="overline">Deploying...</Typography>
              </>
            )}
            {waiting && (
              <>
                <CircularProgress size={25} />
                <Typography variant="overline">
                  Waiting for deploy...
                </Typography>
              </>
            )}
          </Box>
        </Box>
      }
    />
  );
}
