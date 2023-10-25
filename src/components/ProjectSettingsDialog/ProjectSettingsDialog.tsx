import React from "react";
import { useAtom } from "jotai";
import {
  projectScope,
  projectSettingsDialogAtom,
  ProjectSettingsDialogTab,
  rowyRunAtom,
  secretNamesAtom,
  updateSecretNamesAtom,
} from "@src/atoms/projectScope";
import Modal from "@src/components/Modal";
import { Box, Button, Paper, Tab, Tooltip, Typography } from "@mui/material";
import { TabContext, TabPanel, TabList } from "@mui/lab";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import SecretDetailsModal from "./SecretDetailsModal";
import { runRoutes } from "@src/constants/runRoutes";

export default function ProjectSettingsDialog() {
  const [{ open, tab }, setProjectSettingsDialog] = useAtom(
    projectSettingsDialogAtom,
    projectScope
  );
  const [secretNames] = useAtom(secretNamesAtom, projectScope);
  const [secretDetailsModal, setSecretDetailsModal] = React.useState<{
    open: boolean;
    loading?: boolean;
    mode?: "add" | "edit" | "delete";
    secretName?: string;
    error?: string;
  }>({
    open: false,
  });
  const [rowyRun] = useAtom(rowyRunAtom, projectScope);
  const [updateSecretNames] = useAtom(updateSecretNamesAtom, projectScope);

  if (!open) return null;

  const handleClose = () => {
    setProjectSettingsDialog({ open: false });
  };

  const handleTabChange = (
    event: React.SyntheticEvent,
    newTab: ProjectSettingsDialogTab
  ) => {
    setProjectSettingsDialog({ tab: newTab });
  };

  console.log(secretDetailsModal);

  return (
    <>
      <Modal
        onClose={handleClose}
        open={open}
        maxWidth="sm"
        fullWidth
        title={"Project settings"}
        sx={{
          ".MuiDialogContent-root": {
            display: "flex",
            flexDirection: "column",
            height: "100%",
          },
        }}
        children={
          <>
            <TabContext value={tab}>
              <Box
                sx={{
                  borderBottom: 1,
                  borderColor: "divider",
                }}
              >
                <TabList value={tab} onChange={handleTabChange}>
                  <Tab label="Secret keys" value={"secrets"} />
                </TabList>
              </Box>
              <TabPanel
                value={tab}
                sx={{
                  overflowY: "scroll",
                }}
              >
                <Paper elevation={1} variant={"outlined"}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: 3,
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      Secrets
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        setSecretDetailsModal({
                          open: true,
                          mode: "add",
                        });
                      }}
                    >
                      Add secret key
                    </Button>
                  </Box>
                  {secretNames.secretNames?.map((secretName) => (
                    <Box
                      key={secretName}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: 3,
                        borderTop: 1,
                        borderColor: "divider",
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        {secretName}
                      </Typography>
                      <Box>
                        <Tooltip title={"Edit"}>
                          <Button
                            variant="outlined"
                            color="primary"
                            style={{
                              minWidth: "40px",
                              paddingLeft: 0,
                              paddingRight: 0,
                              marginRight: "8px",
                            }}
                            onClick={() => {
                              setSecretDetailsModal({
                                open: true,
                                mode: "edit",
                                secretName,
                              });
                            }}
                          >
                            <EditIcon color={"secondary"} />
                          </Button>
                        </Tooltip>
                        <Tooltip title={"Delete"}>
                          <Button
                            variant="outlined"
                            color="primary"
                            style={{
                              minWidth: "40px",
                              paddingLeft: 0,
                              paddingRight: 0,
                            }}
                            onClick={() => {
                              console.log("setting", {
                                open: true,
                                mode: "delete",
                                secretName,
                              });
                              setSecretDetailsModal({
                                open: true,
                                mode: "delete",
                                secretName,
                              });
                            }}
                          >
                            <DeleteOutlineIcon color={"secondary"} />
                          </Button>
                        </Tooltip>
                      </Box>
                    </Box>
                  ))}
                </Paper>
              </TabPanel>
            </TabContext>
          </>
        }
      />
      <SecretDetailsModal
        open={secretDetailsModal.open}
        mode={secretDetailsModal.mode}
        error={secretDetailsModal.error}
        loading={secretDetailsModal.loading}
        secretName={secretDetailsModal.secretName}
        handleClose={() => {
          setSecretDetailsModal({ ...secretDetailsModal, open: false });
        }}
        handleAdd={async (newSecretName, secretValue) => {
          setSecretDetailsModal({
            ...secretDetailsModal,
            loading: true,
          });
          try {
            await rowyRun({
              route: runRoutes.addSecret,
              body: {
                name: newSecretName,
                value: secretValue,
              },
            });
            setSecretDetailsModal({
              ...secretDetailsModal,
              open: false,
              loading: false,
            });
            // update secret name causes an unknown modal-related bug, to be fixed
            // updateSecretNames?.();
          } catch (error: any) {
            console.error(error);
            setSecretDetailsModal({
              ...secretDetailsModal,
              error: error.message,
            });
          }
        }}
        handleEdit={async (secretName, secretValue) => {
          setSecretDetailsModal({
            ...secretDetailsModal,
            loading: true,
          });
          try {
            await rowyRun({
              route: runRoutes.editSecret,
              body: {
                name: secretName,
                value: secretValue,
              },
            });
            setSecretDetailsModal({
              ...secretDetailsModal,
              open: false,
              loading: false,
            });
            // update secret name causes an unknown modal-related bug, to be fixed
            // updateSecretNames?.();
          } catch (error: any) {
            console.error(error);
            setSecretDetailsModal({
              ...secretDetailsModal,
              error: error.message,
            });
          }
        }}
        handleDelete={async (secretName) => {
          setSecretDetailsModal({
            ...secretDetailsModal,
            loading: true,
          });
          try {
            await rowyRun({
              route: runRoutes.deleteSecret,
              body: {
                name: secretName,
              },
            });
            console.log("Setting", {
              ...secretDetailsModal,
              open: false,
              loading: false,
            });
            setSecretDetailsModal({
              ...secretDetailsModal,
              open: false,
              loading: false,
            });
            // update secret name causes an unknown modal-related bug, to be fixed
            // updateSecretNames?.();
          } catch (error: any) {
            console.error(error);
            setSecretDetailsModal({
              ...secretDetailsModal,
              error: error.message,
            });
          }
        }}
      />
    </>
  );
}
