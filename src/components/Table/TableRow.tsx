import { Fragment } from "react";
import { Row, RowRendererProps } from "react-data-grid";

import OutOfOrderIndicator from "./OutOfOrderIndicator";
import RowContextMenu from "./RowContextMenu";

export default function TableRow(props: RowRendererProps<any>) {
  if (props.row._rowy_outOfOrder)
    return (
      <Fragment key={props.row.id}>
        <OutOfOrderIndicator top={props.top} height={props.height} />
        <Row {...props} />
      </Fragment>
    );

  return (
    <RowContextMenu {...props}>
      <Row {...props} />
    </RowContextMenu>
  );
}
