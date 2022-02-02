import useContextMenuAtom from "@src/hooks/useContextMenuAtom";
import { Fragment } from "react";
import { Row, RowRendererProps } from "react-data-grid";

import OutOfOrderIndicator from "./OutOfOrderIndicator";

export default function TableRow(props: RowRendererProps<any>) {
  const { setContextMenu } = useContextMenuAtom();
  function handleContextMenu(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.preventDefault();
    if (setContextMenu)
      setContextMenu((prev) => ({
        ...prev,
        anchorEl: e?.target as HTMLElement,
      }));
  }
  if (props.row._rowy_outOfOrder)
    return (
      <Fragment key={props.row.id}>
        <OutOfOrderIndicator top={props.top} height={props.height} />
        <Row onContextMenu={(e) => handleContextMenu(e)} {...props} />
      </Fragment>
    );

  return <Row onContextMenu={(e) => handleContextMenu(e)} {...props} />;
}
