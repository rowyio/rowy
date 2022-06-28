import { useAtom } from "jotai";
import { useSnackbar } from "notistack";
import {
  updateDoc,
  doc,
  terminate,
  clearIndexedDbPersistence,
} from "firebase/firestore";

import { Container, Stack, Button } from "@mui/material";

import SettingsSection from "@src/components/Settings/SettingsSection";

import {
  globalScope,
  projectSettingsAtom,
  allUsersAtom,
  updateUserAtom,
} from "@src/atoms/globalScope";
import UserManagementSourceFirebase from "@src/sources/UserManagementSourceFirebase";
import { firebaseDbAtom } from "@src/sources/ProjectSourceFirebase";
import { USERS } from "@src/config/dbPaths";
import { getTableSchemaPath } from "@src/utils/table";

export interface IProjectSettingsChildProps {
  settings: Record<string, any>;
  updateSettings: (data: Record<string, any>) => void;
  publicSettings: Record<string, any>;
  updatePublicSettings: (data: Record<string, any>) => void;
}

export default function DebugSettingsPage() {
  const [firebaseDb] = useAtom(firebaseDbAtom, globalScope);
  const [projectSettings] = useAtom(projectSettingsAtom, globalScope);
  const [users] = useAtom(allUsersAtom, globalScope);
  const [updateUser] = useAtom(updateUserAtom, globalScope);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  return (
    <Container maxWidth="sm" sx={{ px: 1, pt: 1, pb: 7 + 3 + 3 }}>
      <UserManagementSourceFirebase />

      <Stack spacing={4}>
        <SettingsSection title="Reset table filters">
          <Button
            onClick={async () => {
              if (!updateUser)
                enqueueSnackbar("Could not update user settings", {
                  variant: "error",
                });

              const loadingSnackbar = enqueueSnackbar(
                "Resetting all user filters…",
                {
                  persist: true,
                }
              );
              try {
                const promises = users.map((user) =>
                  updateUser!(`${USERS}/${user._rowy_ref!.id}`, {
                    tables: Object.entries(user.tables ?? {}).reduce(
                      (a, [key, table]) => {
                        a[key] = { ...table, filters: [] };
                        return a;
                      },
                      {} as Record<string, any>
                    ),
                  })
                );

                await Promise.all(promises);

                closeSnackbar(loadingSnackbar);
                enqueueSnackbar("Reset all user filters", {
                  variant: "success",
                });
              } catch (e) {
                enqueueSnackbar((e as Error).message, { variant: "error" });
                closeSnackbar(loadingSnackbar);
              }
            }}
            color="error"
            style={{ display: "flex" }}
          >
            Reset all user filters
          </Button>
          <Button
            onClick={async () => {
              if (!projectSettings.tables) {
                enqueueSnackbar("No tables to update");
                return;
              }

              const loadingSnackbar = enqueueSnackbar(
                "Resetting all table-level filters…",
                { persist: true }
              );
              try {
                const promises = projectSettings.tables.map((table) =>
                  updateDoc(
                    doc(firebaseDb, getTableSchemaPath(table)),
                    "filters",
                    []
                  )
                );

                await Promise.all(promises);

                closeSnackbar(loadingSnackbar);
                enqueueSnackbar("Reset all table-level filters", {
                  variant: "success",
                });
              } catch (e) {
                enqueueSnackbar((e as Error).message, { variant: "error" });
                closeSnackbar(loadingSnackbar);
              }
            }}
            color="error"
            style={{ display: "flex" }}
          >
            Reset all table-level filters
          </Button>
        </SettingsSection>

        <SettingsSection
          title="Local Firestore instance"
          transitionTimeout={1 * 100}
        >
          <Button
            onClick={async () => {
              enqueueSnackbar("Clearing cache. Page will reload…", {
                persist: true,
              });
              await terminate(firebaseDb);
              await clearIndexedDbPersistence(firebaseDb);
              window.location.href = "/";
            }}
            color="error"
            style={{ display: "flex" }}
          >
            Reset local Firestore cache
          </Button>
        </SettingsSection>
      </Stack>
    </Container>
  );
}
