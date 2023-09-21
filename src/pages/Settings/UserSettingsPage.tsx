import { useEffect } from "react";
import { useAtom } from "jotai";
import { useSnackbar } from "notistack";
import { useDebouncedCallback } from "use-debounce";

import { Container, Stack, Fade } from "@mui/material";

import SettingsSkeleton from "@src/components/Settings/SettingsSkeleton";
import SettingsSection from "@src/components/Settings/SettingsSection";
import Account from "@src/components/Settings/UserSettings/Account";
import Theme from "@src/components/Settings/UserSettings/Theme";
import TableSettings from "@src/components/Settings/UserSettings/TableSettings";
import Personalization from "@src/components/Settings/UserSettings/Personalization";

import {
  projectScope,
  currentUserAtom,
  userSettingsAtom,
  updateUserSettingsAtom,
} from "@src/atoms/projectScope";
import { useScrollToHash } from "@src/hooks/useScrollToHash";
import { UserSettings } from "@src/types/settings";

export interface IUserSettingsChildProps {
  settings: UserSettings;
  updateSettings: (data: Partial<UserSettings>) => void;
}

export default function UserSettingsPage() {
  const [currentUser] = useAtom(currentUserAtom, projectScope);
  const [userSettings] = useAtom(userSettingsAtom, projectScope);
  const { enqueueSnackbar } = useSnackbar();
  useScrollToHash();

  const [_updateUserSettings] = useAtom(updateUserSettingsAtom, projectScope);
  const updateSettings = useDebouncedCallback((data) => {
    if (_updateUserSettings) {
      _updateUserSettings(data).then(() => enqueueSnackbar("Saved"));
    } else {
      enqueueSnackbar("Could not update project settings", {
        variant: "error",
      });
    }
  }, 1000);
  // When the component is to be unmounted, force update settings
  useEffect(
    () => () => {
      updateSettings.flush();
    },
    [updateSettings]
  );

  const childProps: IUserSettingsChildProps = {
    settings: userSettings,
    updateSettings,
  };

  const sections = [
    { title: "Account", Component: Account, props: childProps },
    { title: "Theme", Component: Theme, props: childProps },
    { title: "Table Settings", Component: TableSettings, props: childProps },
    { title: "Personalization", Component: Personalization, props: childProps },
  ];

  return (
    <Container maxWidth="sm" sx={{ px: 1, pt: 1, pb: 7 + 3 + 3 }}>
      {!currentUser ? (
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
