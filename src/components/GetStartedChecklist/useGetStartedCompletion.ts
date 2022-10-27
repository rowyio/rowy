import { useAtom } from "jotai";
import {
  projectScope,
  tablesAtom,
  userSettingsAtom,
  allUsersAtom,
} from "@src/atoms/projectScope";

export default function useGetStartedCompletion() {
  const [tables] = useAtom(tablesAtom, projectScope);
  const [userSettings] = useAtom(userSettingsAtom, projectScope);
  const [allUsers] = useAtom(allUsersAtom, projectScope);

  const completedSteps = {
    project: true,
    tutorial: Boolean(userSettings.tableTutorialComplete),
    table: tables.length > 0,
    members: allUsers.length > 0,
  };

  return [
    completedSteps,
    Object.values(completedSteps).reduce((a, c) => (c ? a + 1 : a), 0),
  ] as const;
}
