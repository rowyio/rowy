import { useProjectContext } from "@src/contexts/ProjectContext";
import { Fragment } from "react";
import { Row, RowRendererProps } from "react-data-grid";

import OutOfOrderIndicator from "./OutOfOrderIndicator";

export default function TableRow(props: RowRendererProps<any>) {
  const { contextMenuRef }: any = useProjectContext();
  const handleContextMenu = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (contextMenuRef?.current) contextMenuRef?.current?.setAnchorEl(e.target);
  };

  if (props.row._rowy_outOfOrder)
    return (
      <Fragment key={props.row.id}>
        <OutOfOrderIndicator top={props.top} height={props.height} />
        <Row {...props} onContextMenu={handleContextMenu} />
      </Fragment>
    );

  return <Row {...props} onContextMenu={handleContextMenu} />;
}
