import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { merge } from "lodash-es";

import themes from "@src/theme";
import { publicSettingsAtom } from "./project";
import { UserSettings } from "@src/types/settings";
import { UpdateDocFunction } from "@src/types/table";

/** User info and settings */
export const userSettingsAtom = atom<UserSettings>({});
/** Stores a function that updates user settings */
export const updateUserSettingsAtom = atom<
  UpdateDocFunction<UserSettings> | undefined
>(undefined);

/**
 * Stores which theme is currently active, based on user or OS setting.
 * Saved in localStorage.
 */
export const themeAtom = atomWithStorage<"light" | "dark">(
  "__ROWY__THEME",
  "light"
);
/**
 * User can override OS theme. Saved in localStorage.
 */
export const themeOverriddenAtom = atomWithStorage(
  "__ROWY__THEME_OVERRIDDEN",
  false
);

/** User's default table settings (affecting saving and popup behavior) */
export const defaultTableSettingsAtom = atom((get) => {
  const userSettings = get(userSettingsAtom);
  return userSettings.defaultTableSettings;
});

/** Customized base theme based on project and user settings */
export const customizedThemesAtom = atom((get) => {
  const publicSettings = get(publicSettingsAtom);
  const userSettings = get(userSettingsAtom);

  const lightCustomizations = merge(
    {},
    publicSettings.theme?.base,
    publicSettings.theme?.light,
    userSettings.theme?.base,
    userSettings.theme?.light
  );
  const darkCustomizations = merge(
    {},
    publicSettings.theme?.base,
    publicSettings.theme?.dark,
    userSettings.theme?.base,
    userSettings.theme?.dark
  );

  return {
    light: themes.light(lightCustomizations),
    dark: themes.dark(darkCustomizations),
  };
});
