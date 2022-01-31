import { Column } from "react-data-grid";

import { Button } from "@mui/material";
import AddColumnIcon from "@src/assets/icons/AddColumn";

import { useAppContext } from "@src/contexts/AppContext";
import { useProjectContext } from "@src/contexts/ProjectContext";

const FinalColumnHeader: Column<any>["headerRenderer"] = ({ column }) => {
  const { userClaims } = useAppContext();
  const { columnMenuRef } = useProjectContext();
  if (!columnMenuRef) return null;

  if (!userClaims?.roles.includes("ADMIN")) return null;

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) =>
    columnMenuRef?.current?.setSelectedColumnHeader({
      column,
      anchorEl: event.currentTarget,
    });

  return (
    <Button
      onClick={handleClick}
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
