import { useProjectContext } from "@src/contexts/ProjectContext";
import { Fragment, useEffect } from "react";
import { Row, RowRendererProps } from "react-data-grid";

import OutOfOrderIndicator from "./OutOfOrderIndicator";

export default function TableRow(props: RowRendererProps<any>) {
  if (props.row._rowy_outOfOrder)
    return (
      <Fragment key={props.row.id}>
        <OutOfOrderIndicator top={props.top} height={props.height} />
        <ContextMenuWrapper>
          <Row {...props} />
        </ContextMenuWrapper>
      </Fragment>
    );

  return (
    <ContextMenuWrapper>
      {" "}
      <Row {...props} />
    </ContextMenuWrapper>
  );
}
///use the react advance pattern here
const ContextMenuWrapper = (props: any) => {
  const { cellMenuRef }: any = useProjectContext();

  const handleClick = (e: any) => {
    e.preventDefault();
    const input = e?.target as HTMLElement;
    cellMenuRef.current.setAnchorEl(input);
  };
  return <span onContextMenu={handleClick}>{props.children}</span>;
};
