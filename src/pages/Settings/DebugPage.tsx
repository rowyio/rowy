import { useAtom } from "jotai";
import { useSnackbar } from "notistack";
import {
  updateDoc,
  doc,
  terminate,
  clearIndexedDbPersistence,
} from "firebase/firestore";

import { Container, Stack, Button } from "@mui/material";
import InlineOpenInNewIcon from "@src/components/InlineOpenInNewIcon";

import SettingsSection from "@src/components/Settings/SettingsSection";

import {
  projectScope,
  projectIdAtom,
  projectSettingsAtom,
  userRolesAtom,
  allUsersAtom,
  updateUserAtom,
} from "@src/atoms/projectScope";
import UserManagementSourceFirebase from "@src/sources/MembersSourceFirebase";
import { firebaseDbAtom } from "@src/sources/ProjectSourceFirebase";
import { CONFIG, TABLE_SCHEMAS, USERS } from "@src/config/dbPaths";
import { getTableSchemaPath } from "@src/utils/table";
import { useScrollToHash } from "@src/hooks/useScrollToHash";

export default function DebugPage() {
  const [firebaseDb] = useAtom(firebaseDbAtom, projectScope);
  const [projectId] = useAtom(projectIdAtom, projectScope);
  const [projectSettings] = useAtom(projectSettingsAtom, projectScope);
  const [userRoles] = useAtom(userRolesAtom, projectScope);
  const [users] = useAtom(allUsersAtom, projectScope);
  const [updateUser] = useAtom(updateUserAtom, projectScope);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  useScrollToHash();

  return (
    <Container maxWidth="sm" sx={{ px: 1, pt: 1, pb: 7 + 3 + 3 }}>
      {userRoles.includes("ADMIN") && <UserManagementSourceFirebase />}

      <Stack spacing={4}>
        <SettingsSection title="Firestore config" transitionTimeout={0 * 100}>
          <Button
            href={`https://console.firebase.google.com/project/${projectId}/firestore/data/~2F${CONFIG.replace(
              /\//g,
              "~2F"
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            color="primary"
            style={{ display: "flex", width: "max-content" }}
          >
            Config <InlineOpenInNewIcon />
          </Button>

          <Button
            href={`https://console.firebase.google.com/project/${projectId}/firestore/data/~2F${TABLE_SCHEMAS.replace(
              /\//g,
              "~2F"
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            color="primary"
            style={{ display: "flex", width: "max-content" }}
          >
            Table schemas <InlineOpenInNewIcon />
          </Button>

          <Button
            href={`https://console.firebase.google.com/project/${projectId}/firestore/data/~2F${USERS.replace(
              /\//g,
              "~2F"
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            color="primary"
            style={{ display: "flex", width: "max-content" }}
          >
            Users <InlineOpenInNewIcon />
          </Button>
        </SettingsSection>

        {userRoles.includes("ADMIN") && (
          <SettingsSection
            title="Reset table filters"
            transitionTimeout={1 * 100}
          >
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
        )}

        <SettingsSection
          title="Local Firestore instance"
          transitionTimeout={2 * 100}
        >
          <Button
            onClick={async () => {
              enqueueSnackbar("Clearing cache. Page will reload…", {
                persist: true,
              });
              await terminate(firebaseDb);
              await clearIndexedDbPersistence(firebaseDb);
              window.location.reload();
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
