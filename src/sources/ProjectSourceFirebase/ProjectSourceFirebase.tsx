import { memo, useEffect } from "react";
import { useAtom, useSetAtom } from "jotai";

import { globalScope, projectIdAtom } from "@src/atoms/globalScope";
import { firebaseConfigAtom } from "./init";

import { useAuthUser } from "./useAuthUser";
import { useSettingsDocs } from "./useSettingsDocs";
import { useTableFunctions } from "./useTableFunctions";

/**
 * When rendered, connects to a Firebase project and populates
 * all atoms in src/atoms/globalScope/project.
 */
export const ProjectSourceFirebase = memo(function ProjectSourceFirebase() {
  // Set projectId from Firebase project
  const [firebaseConfig] = useAtom(firebaseConfigAtom, globalScope);
  const setProjectId = useSetAtom(projectIdAtom, globalScope);
  useEffect(() => {
    setProjectId(firebaseConfig.projectId || "");
  }, [firebaseConfig.projectId, setProjectId]);

  // Sets currentUser and userRoles based on Firebase Auth user.
  useAuthUser();

  // Sets listeners to public settings, project settings, and user settings.
  // Also sets functions to update those documents.
  useSettingsDocs();
  useTableFunctions();
  console.log("rerender");

  return null;
});

export default ProjectSourceFirebase;
