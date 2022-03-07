import { useEffect } from "react";
import { useSnackbar } from "notistack";
import { useDebouncedCallback } from "use-debounce";

import { Container, Stack, Fade } from "@mui/material";

import SettingsSkeleton from "@src/components/Settings/SettingsSkeleton";
import SettingsSection from "@src/components/Settings/SettingsSection";
import About from "@src/components/Settings/ProjectSettings/About";
import RowyRun from "@src/components/Settings/ProjectSettings/RowyRun";
import Authentication from "@src/components/Settings/ProjectSettings/Authentication";
import Customization from "@src/components/Settings/ProjectSettings/Customization";

import { SETTINGS, PUBLIC_SETTINGS } from "@src/config/dbPaths";
import useDoc from "@src/hooks/useDoc";
import { db } from "@src/firebase";

export interface IProjectSettingsChildProps {
  settings: Record<string, any>;
  updateSettings: (data: Record<string, any>) => void;
  publicSettings: Record<string, any>;
  updatePublicSettings: (data: Record<string, any>) => void;
}

export default function ProjectSettingsPage() {
  const { enqueueSnackbar } = useSnackbar();

  const [settingsState] = useDoc({ path: SETTINGS }, { createIfMissing: true });
  const settings = settingsState.doc;
  const [updateSettings, , callPending] = useDebouncedCallback(
    (data: Record<string, any>) =>
      db
        .doc(SETTINGS)
        .update(data)
        .then(() => enqueueSnackbar("Saved", { variant: "success" })),
    1000
  );

  const [publicSettingsState] = useDoc(
    { path: PUBLIC_SETTINGS },
    { createIfMissing: true }
  );
  const publicSettings = publicSettingsState.doc;
  const [updatePublicSettings, , callPendingPublic] = useDebouncedCallback(
    (data: Record<string, any>) =>
      db
        .doc(PUBLIC_SETTINGS)
        .update(data)
        .then(() => enqueueSnackbar("Saved", { variant: "success" })),
    1000
  );

  useEffect(
    () => () => {
      callPending();
      callPendingPublic();
    },
    []
  );

  const childProps: IProjectSettingsChildProps = {
    settings,
    updateSettings,
    publicSettings,
    updatePublicSettings,
  };

  const sections = [
    { title: "About", Component: About },
    { title: `Rowy Run`, Component: RowyRun, props: childProps },
    { title: "Authentication", Component: Authentication, props: childProps },
    { title: "Customization", Component: Customization, props: childProps },
  ];

  return (
    <Container maxWidth="sm" sx={{ px: 1, pt: 1, pb: 7 + 3 + 3 }}>
      {settingsState.loading || publicSettingsState.loading ? (
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
