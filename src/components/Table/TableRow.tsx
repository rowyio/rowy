import { Fragment } from "react";
import { useSetAtom } from "jotai";
import { Row, RowRendererProps } from "react-data-grid";

import OutOfOrderIndicator from "./OutOfOrderIndicator";

import { tableScope, contextMenuTargetAtom } from "@src/atoms/tableScope";

export default function TableRow(props: RowRendererProps<any>) {
  const setContextMenuTarget = useSetAtom(contextMenuTargetAtom, tableScope);
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenuTarget(e?.target as HTMLElement);
  };

  if (props.row._rowy_outOfOrder)
    return (
      <Fragment key={props.row._rowy_ref.path}>
        {/* <OutOfOrderIndicator top={props.top} height={props.height} /> */}
        <Row onContextMenu={handleContextMenu} {...props} />
      </Fragment>
    );

  return (
    <Row
      key={props.row._rowy_ref.path}
      id={`row-${props.row._rowy_ref.path}`}
      onContextMenu={handleContextMenu}
      {...props}
    />
  );
}
