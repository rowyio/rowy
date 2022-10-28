import { useAtom } from "jotai";

import {
  projectScope,
  projectSettingsAtom,
  updateProjectSettingsAtom,
  publicSettingsAtom,
  updatePublicSettingsAtom,
  currentUserAtom,
  userSettingsAtom,
  updateUserSettingsAtom,
} from "@src/atoms/projectScope";

import useFirestoreDocWithAtom from "@src/hooks/useFirestoreDocWithAtom";
import { SETTINGS, PUBLIC_SETTINGS, USERS } from "@src/config/dbPaths";

/**
 * Sets listeners to public settings, project settings, and user settings.
 * Also sets functions to update those documents.
 */
export function useSettingsDocs() {
  const [currentUser] = useAtom(currentUserAtom, projectScope);

  // Store public settings in atom
  useFirestoreDocWithAtom(publicSettingsAtom, projectScope, PUBLIC_SETTINGS, {
    updateDataAtom: updatePublicSettingsAtom,
  });

  // Store project settings in atom when a user is signed in.
  // If they have no access, display AccessDenied screen via ErrorBoundary.
  useFirestoreDocWithAtom(
    projectSettingsAtom,
    projectScope,
    currentUser ? SETTINGS : undefined,
    { updateDataAtom: updateProjectSettingsAtom }
  );

  const roles =
    JSON.parse((currentUser as any)?.reloadUserInfo?.customAttributes ?? "{}")
      ?.roles ?? [];
  // Store user settings in atom when a user is signed in
  useFirestoreDocWithAtom(userSettingsAtom, projectScope, USERS, {
    pathSegments: [currentUser?.uid],
    createIfNonExistent: currentUser
      ? {
          user: {
            email: currentUser.email || "",
            displayName: currentUser.displayName || undefined,
            photoURL: currentUser.photoURL || undefined,
            phoneNumber: currentUser.phoneNumber || undefined,
          },
          roles,
        }
      : undefined,
    updateDataAtom: updateUserSettingsAtom,
  });
}
