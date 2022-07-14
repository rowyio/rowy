import { useAtom, useSetAtom } from "jotai";

import { Typography, Button } from "@mui/material";
import UncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CheckedIcon from "@mui/icons-material/CheckCircleOutline";
import AddIcon from "@mui/icons-material/Add";
import MembersIcon from "@mui/icons-material/AccountCircleOutlined";
import { Project as ProjectIcon } from "@src/assets/icons";

import Modal, { IModalProps } from "@src/components/Modal";
import SteppedAccordion from "@src/components/SteppedAccordion";
import StepsProgress from "@src/components/StepsProgress";

import {
  globalScope,
  getStartedChecklistAtom,
  tableSettingsDialogAtom,
} from "@src/atoms/globalScope";
import {
  NAV_DRAWER_WIDTH,
  NAV_DRAWER_COLLAPSED_WIDTH,
} from "@src/layouts/Navigation/NavDrawer";

export interface IGetStartedChecklistProps extends Partial<IModalProps> {
  navOpen: boolean;
  navPermanent: boolean;
}

export default function GetStartedChecklist({
  navOpen,
  navPermanent,
  ...props
}: IGetStartedChecklistProps) {
  const [open, setOpen] = useAtom(getStartedChecklistAtom, globalScope);
  const openTableSettingsDialog = useSetAtom(
    tableSettingsDialogAtom,
    globalScope
  );

  if (!open) return null;

  return (
    <Modal
      {...props}
      onClose={() => setOpen(false)}
      title="Get started"
      hideBackdrop
      maxWidth="xs"
      PaperProps={{ elevation: 8 }}
      fullScreen={false}
      sx={[
        {
          "& .MuiDialog-container": {
            justifyContent: "flex-start",
            alignItems: "flex-end",
          },

          "& .MuiDialog-paper": {
            marginLeft: {
              xs: `max(env(safe-area-inset-left), 8px)`,
              sm: `max(env(safe-area-inset-left), ${
                (navPermanent
                  ? navOpen
                    ? NAV_DRAWER_WIDTH
                    : NAV_DRAWER_COLLAPSED_WIDTH
                  : 0) + 8
              }px)`,
            },
            marginBottom: `max(env(safe-area-inset-bottom), 8px)`,
            marginRight: `max(env(safe-area-inset-right), 8px)`,
            width: 360,
          },
        },
      ]}
    >
      <StepsProgress value={1} steps={5} sx={{ mb: 2 }} />

      <SteppedAccordion
        steps={[
          {
            id: "workspace",
            title: "Create a workspace",
            labelButtonProps: {
              icon: (
                <CheckedIcon color="success" sx={{ color: "success.light" }} />
              ),
            },
            content: null,
          },
          {
            id: "tutorial",
            title: "Complete the table tutorial",
            labelButtonProps: { icon: <UncheckedIcon color="action" /> },
            content: (
              <>
                <Typography>This is why you should</Typography>
                <Button variant="contained" color="primary">
                  Begin tutorial
                </Button>
              </>
            ),
          },
          {
            id: "project",
            title: "Create a project",
            labelButtonProps: { icon: <UncheckedIcon color="action" /> },
            content: (
              <>
                <Typography>
                  You’re ready to create a project and connect to a data source
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<ProjectIcon />}
                >
                  Create project
                </Button>
              </>
            ),
          },
          {
            id: "table",
            title: "Create a table",
            labelButtonProps: { icon: <UncheckedIcon color="action" /> },
            content: (
              <>
                <Typography>This is why you should</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={() => openTableSettingsDialog({ open: true })}
                >
                  Create table
                </Button>
              </>
            ),
          },
          {
            id: "members",
            title: "Invite team members",
            labelButtonProps: { icon: <UncheckedIcon color="action" /> },
            content: (
              <>
                <Typography>
                  Go to the members page to invite someone
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<MembersIcon />}
                >
                  Members
                </Button>
              </>
            ),
          },
        ]}
        sx={{
          "& .MuiStepConnector-root": {
            my: -10 / 8,
          },
          "& .Mui-active + .MuiStep-root:not(:last-of-type) .MuiStepContent-root":
            {
              mt: -10 / 8,
              pt: 10 / 8,
              mb: 10 / 8,
              pb: 2,
            },
          "& .MuiStepContent-root .MuiCollapse-wrapperInner > * + *": {
            mt: 1,
          },
        }}
      />
    </Modal>
  );
}
