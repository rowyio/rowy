import { useProjectContext } from "@src/contexts/ProjectContext";
import { Fragment } from "react";
import { Row, RowRendererProps } from "react-data-grid";

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
  const { contextMenuRef }: any = useProjectContext();
  function handleClick(e: any) {
    e.preventDefault();
    const input = e?.target as HTMLElement;
    if (contextMenuRef?.current) {
      contextMenuRef?.current?.setAnchorEl(input);
    }
  }
  return <span onContextMenu={(e) => handleClick(e)}>{props.children}</span>;
};
