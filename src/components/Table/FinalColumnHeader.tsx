import { useAtom, useSetAtom } from "jotai";
import { Column } from "react-data-grid";

import { Button } from "@mui/material";
import AddColumnIcon from "@src/assets/icons/AddColumn";

import {
  globalScope,
  userRolesAtom,
  columnModalAtom,
} from "@src/atoms/globalScope";

const FinalColumnHeader: Column<any>["headerRenderer"] = ({ column }) => {
  const [userRoles] = useAtom(userRolesAtom, globalScope);
  const openColumnModal = useSetAtom(columnModalAtom, globalScope);

  if (!userRoles.includes("ADMIN")) return null;

  return (
    <Button
      onClick={(e) => openColumnModal({ type: "new" })}
      variant="contained"
      color="primary"
      startIcon={<AddColumnIcon />}
      style={{ zIndex: 1 }}
    >
      Add column
    </Button>
  );
};

export default FinalColumnHeader;
