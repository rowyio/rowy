import { useAtom } from "jotai";
import { RESET } from "jotai/utils";

import TableToolbarButton from "@src/components/TableToolbar/TableToolbarButton";
import InfoIcon from "@mui/icons-material/InfoOutlined";

import {
  sideDrawerAtom,
  tableScope,
  tableSettingsAtom,
} from "@src/atoms/tableScope";

export default function TableInformation() {
  const [tableSettings] = useAtom(tableSettingsAtom, tableScope);
  const [sideDrawer, setSideDrawer] = useAtom(sideDrawerAtom, tableScope);

  return (
    <TableToolbarButton
      title="Table information"
      icon={<InfoIcon />}
      onClick={() => setSideDrawer(sideDrawer ? RESET : "table-information")}
      disabled={!setSideDrawer || tableSettings.id.includes("/")}
    />
  );
}
