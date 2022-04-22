import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { DocumentData } from "firebase/firestore";
import { merge } from "lodash-es";

import themes from "@src/theme";
import { publicSettingsAtom } from "./project";

export const userSettingsAtom = atom<DocumentData>({});

export const themeAtom = atomWithStorage<"light" | "dark">(
  "__ROWY__THEME",
  "light"
);
export const themeOverriddenAtom = atomWithStorage(
  "__ROWY__THEME_OVERRIDDEN",
  false
);

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
