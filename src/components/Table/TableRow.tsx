import { useProjectContext } from "@src/contexts/ProjectContext";
import useContextMenuAtom from "@src/hooks/useContextMenuAtom";
import { Fragment } from "react";
import { Row, RowRendererProps } from "react-data-grid";
import { IContextMenuActions } from "../fields/_BasicCell/BasicCellContextMenuActions";

import OutOfOrderIndicator from "./OutOfOrderIndicator";

export default function TableRow(props: RowRendererProps<any>) {
  if (props.row._rowy_outOfOrder)
    return (
      <Fragment key={props.row.id}>
        <OutOfOrderIndicator top={props.top} height={props.height} />
        <ContextMenu>
          <Row {...props} />
        </ContextMenu>
      </Fragment>
    );

  return (
    <ContextMenu>
      <Row {...props} />
    </ContextMenu>
  );
}

const ContextMenu = (props: any) => {
  const { setContextMenu } = useContextMenuAtom();
  function handleClick(e: any) {
    e.preventDefault();
    if (setContextMenu)
      setContextMenu((prev) => ({
        ...prev,
        anchorEl: e?.target as HTMLElement,
      }));
  }
  return <span onContextMenu={(e) => handleClick(e)}>{props.children}</span>;
};
