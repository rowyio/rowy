import { useAtom } from "jotai";

import NewColumnModal from "./NewColumnModal";
import NameChangeModal from "./NameChangeModal";
import TypeChangeModal from "./TypeChangeModal";
import ColumnConfigModal from "./ColumnConfigModal";

import { globalScope, columnModalAtom } from "@src/atoms/globalScope";
import { tableScope, tableSchemaAtom } from "@src/atoms/tableScope";
import { ColumnConfig } from "@src/types/table";

export interface IColumnModalProps {
  handleClose: () => void;
  column: ColumnConfig;
}

export default function ColumnModals() {
  const [columnModal, setColumnModal] = useAtom(columnModalAtom, globalScope);
  const [tableSchema] = useAtom(tableSchemaAtom, tableScope);

  if (!columnModal) return null;

  const handleClose = () => setColumnModal(null);

  if (columnModal.type === "new")
    return <NewColumnModal handleClose={handleClose} />;

  const column = tableSchema.columns?.[columnModal.columnKey ?? ""];
  if (!column) return null;

  if (columnModal.type === "name")
    return <NameChangeModal handleClose={handleClose} column={column} />;

  if (columnModal.type === "type")
    return <TypeChangeModal handleClose={handleClose} column={column} />;

  if (columnModal.type === "config")
    return <ColumnConfigModal handleClose={handleClose} column={column} />;

  return null;
}
