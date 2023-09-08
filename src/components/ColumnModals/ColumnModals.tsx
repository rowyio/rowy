import { useAtom } from "jotai";
import { RESET } from "jotai/utils";

import NewColumnModal from "./NewColumnModal";
import NameChangeModal from "./NameChangeModal";
import TypeChangeModal from "./TypeChangeModal";
import ColumnConfigModal from "./ColumnConfigModal";
import SetColumnWidthModal from "./SetColumnWidthModal";

import {
  tableScope,
  tableSchemaAtom,
  columnModalAtom,
} from "@src/atoms/tableScope";
import { ColumnConfig } from "@src/types/table";

export interface IColumnModalProps {
  onClose: () => void;
  column: ColumnConfig;
}

export default function ColumnModals() {
  const [tableSchema] = useAtom(tableSchemaAtom, tableScope);
  const [columnModal, setColumnModal] = useAtom(columnModalAtom, tableScope);

  if (!columnModal) return null;

  const onClose = () => setColumnModal(RESET);

  if (columnModal.type === "new") return <NewColumnModal onClose={onClose} />;

  const column = tableSchema.columns?.[columnModal.columnKey ?? ""];
  if (!column) return null;

  if (columnModal.type === "name")
    return <NameChangeModal onClose={onClose} column={column} />;

  if (columnModal.type === "type")
    return <TypeChangeModal onClose={onClose} column={column} />;

  if (columnModal.type === "config")
    return <ColumnConfigModal onClose={onClose} column={column} />;

  if (columnModal.type === "setColumnWidth")
    return <SetColumnWidthModal onClose={onClose} column={column} />;

  return null;
}
