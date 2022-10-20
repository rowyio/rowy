import { useAtom } from "jotai";
import { RESET } from "jotai/utils";

import {
  sideDrawerAtom,
  tableScope,
  tableSettingsAtom,
} from "@src/atoms/tableScope";

import TableToolbarButton from "@src/components/TableToolbar/TableToolbarButton";
import { TableInformation as TableInformationIcon } from "@src/assets/icons";

export default function TableInformation() {
  const [tableSettings] = useAtom(tableSettingsAtom, tableScope);
  const [sideDrawer, setSideDrawer] = useAtom(sideDrawerAtom, tableScope);

  return (
    <TableToolbarButton
      title="Table Information"
      icon={<TableInformationIcon />}
      onClick={() => setSideDrawer(sideDrawer ? RESET : "table-information")}
      disabled={!setSideDrawer || tableSettings.id.includes("/")}
    />
  );
}
