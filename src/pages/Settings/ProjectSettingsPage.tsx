import { useEffect } from "react";
import { useAtom } from "jotai";
import { useSnackbar } from "notistack";
import { useDebouncedCallback } from "use-debounce";

import { Container, Stack } from "@mui/material";

import SettingsSection from "@src/components/Settings/SettingsSection";
import About from "@src/components/Settings/ProjectSettings/About";
import RowyRun from "@src/components/Settings/ProjectSettings/RowyRun";
import Authentication from "@src/components/Settings/ProjectSettings/Authentication";
import Customization from "@src/components/Settings/ProjectSettings/Customization";

import {
  globalScope,
  projectSettingsAtom,
  updateProjectSettingsAtom,
  publicSettingsAtom,
  updatePublicSettingsAtom,
} from "@src/atoms/globalScope";

export interface IProjectSettingsChildProps {
  settings: Record<string, any>;
  updateSettings: (data: Record<string, any>) => void;
  publicSettings: Record<string, any>;
  updatePublicSettings: (data: Record<string, any>) => void;
}

export default function ProjectSettingsPage() {
  const [projectSettings] = useAtom(projectSettingsAtom, globalScope);
  const [publicSettings] = useAtom(publicSettingsAtom, globalScope);

  const { enqueueSnackbar } = useSnackbar();

  const [_updateProjectSettingsDoc] = useAtom(
    updateProjectSettingsAtom,
    globalScope
  );
  const updateProjectSettings = useDebouncedCallback((data) => {
    if (_updateProjectSettingsDoc) {
      _updateProjectSettingsDoc(data).then(() => enqueueSnackbar("Saved"));
    } else {
      enqueueSnackbar("Could not update project settings", {
        variant: "error",
      });
    }
  }, 1000);
  // When the component is to be unmounted, force update settings
  useEffect(
    () => () => {
      updateProjectSettings.flush();
    },
    [updateProjectSettings]
  );

  const [_updatePublicSettingsDoc] = useAtom(
    updatePublicSettingsAtom,
    globalScope
  );
  const updatePublicSettings = useDebouncedCallback(
    (data: Record<string, any>) => {
      if (_updatePublicSettingsDoc) {
        _updatePublicSettingsDoc(data).then(() =>
          enqueueSnackbar("Saved", { variant: "success" })
        );
      } else {
        enqueueSnackbar("Could not update public settings", {
          variant: "error",
        });
      }
    },
    1000
  );
  // When the component is to be unmounted, force update settings
  useEffect(
    () => () => {
      updatePublicSettings.flush();
    },
    [updatePublicSettings]
  );

  const childProps: IProjectSettingsChildProps = {
    settings: projectSettings,
    updateSettings: updateProjectSettings,
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
    </Container>
  );
}
