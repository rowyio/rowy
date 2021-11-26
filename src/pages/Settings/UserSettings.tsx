import { useEffect } from "react";
import { useSnackbar } from "notistack";
import { useDebouncedCallback } from "use-debounce";

import { Container, Stack, Fade } from "@mui/material";

import SettingsSkeleton from "@src/components/Settings/SettingsSkeleton";
import SettingsSection from "@src/components/Settings/SettingsSection";
import Account from "@src/components/Settings/UserSettings/Account";
import Theme from "@src/components/Settings/UserSettings/Theme";
import Personalization from "@src/components/Settings/UserSettings/Personalization";

import { useAppContext } from "@src/contexts/AppContext";
import { USERS } from "@src/config/dbPaths";
import useDoc from "@src/hooks/useDoc";
import { db } from "@src/firebase";

export interface IUserSettingsChildProps {
  settings: Record<string, any>;
  updateSettings: (data: Record<string, any>) => void;
}

export default function UserSettingsPage() {
  const { currentUser } = useAppContext();
  const { enqueueSnackbar } = useSnackbar();

  const path = `${USERS}/${currentUser?.uid}`;

  const [settingsState] = useDoc({ path }, { createIfMissing: true });
  const settings = settingsState.doc;
  const [updateSettings, , callPending] = useDebouncedCallback(
    (data: Record<string, any>) =>
      db
        .doc(path)
        .update(data)
        .then(() => enqueueSnackbar("Saved", { variant: "success" })),
    1000
  );

  useEffect(
    () => () => {
      callPending();
    },
    []
  );

  const childProps: IUserSettingsChildProps = { settings, updateSettings };

  const sections = [
    { title: "Account", Component: Account, props: childProps },
    { title: "Theme", Component: Theme, props: childProps },
    { title: "Personalization", Component: Personalization, props: childProps },
  ];

  return (
    <Container maxWidth="sm" sx={{ px: 1, pt: 1, pb: 7 + 3 + 3 }}>
      {!currentUser || settingsState.loading ? (
        <Fade in timeout={1000} style={{ transitionDelay: "1s" }} unmountOnExit>
          <Stack spacing={4}>
            {new Array(sections.length).fill(null).map((_, i) => (
              <SettingsSkeleton key={i} />
            ))}
          </Stack>
        </Fade>
      ) : (
        <Stack spacing={4}>
          {sections.map(({ title, Component, props }, i) => (
            <SettingsSection
              key={title}
              title={title}
              transitionTimeout={(i + 1) * 100}
            >
              <Component {...(props as any)} />
            </SettingsSection>
          ))}
        </Stack>
      )}
    </Container>
  );
}
