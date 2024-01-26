import { compatibleRowyRunVersionAtom, projectScope, projectSettingsAtom, rowyRunModalAtom } from "@src/atoms/projectScope";
import { tableModalAtom, tableScope } from "@src/atoms/tableScope";
import { TableToolsType } from "@src/types/table";
import { useAtom, useSetAtom } from "jotai";
import { useRegisterActions } from "kbar";

const AdminToolbarActionsRegister = ({
  disabledTools,
}: {
  disabledTools?: TableToolsType[];
}) => {
  const [projectSettings] = useAtom(projectSettingsAtom, projectScope);
  const openRowyRunModal = useSetAtom(rowyRunModalAtom, projectScope);
  const openTableModal = useSetAtom(tableModalAtom, tableScope);
  const [compatibleRowyRunVersion] = useAtom(
    compatibleRowyRunVersionAtom,
    projectScope
  );
  useRegisterActions([
    {
      id: "extensions",
      name: "Table Extensions",
      shortcut: ["x", "e"],
      keywords: "open extensions",
      perform: () => {
        if (!disabledTools?.includes("extensions")) {
          if (projectSettings.rowyRunUrl) openTableModal("extensions");
          else openRowyRunModal({ feature: "Extensions" });
        }
      },
    },
    {
      id: "webhooks",
      name: "Webhooks",
      shortcut: ["x", "w"],
      keywords: "webhooks",
      perform: () => {
        if (!disabledTools?.includes("webhooks")) {
          if (compatibleRowyRunVersion({ minVersion: "1.2.0" })) {
            openTableModal("webhooks");
          } else {
            openRowyRunModal({ feature: "Webhooks", version: "1.2.0" });
          }
        }
      },
    },
    {
      id: "cloudLogs",
      name: "Cloud logs",
      shortcut: ["x", "l"],
      keywords: "cloud logs",
      perform: () => {
        if (!disabledTools?.includes("cloud_logs")) {
          if (projectSettings.rowyRunUrl) openTableModal("cloudLogs");
          else openRowyRunModal({ feature: "Cloud logs" });
        }
      },
    },
  ]);

  return null;
};

export default AdminToolbarActionsRegister