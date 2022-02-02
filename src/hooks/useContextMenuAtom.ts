import { useAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import { contextMenuAtom } from "@src/atoms/ContextMenu";

export default function useContextMenuAtom() {
  const [contextMenu, setContextMenu] = useAtom(contextMenuAtom);
  const resetContextMenu = useResetAtom(contextMenuAtom);

  return {
    contextMenu,
    setContextMenu,
    resetContextMenu,
  };
}
