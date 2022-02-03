import { useSetAnchorEle } from "@src/atoms/ContextMenu";
import { Fragment } from "react";
import { Row, RowRendererProps } from "react-data-grid";

import OutOfOrderIndicator from "./OutOfOrderIndicator";

export default function TableRow(props: RowRendererProps<any>) {
  const { setAnchorEle } = useSetAnchorEle();
  const handleContextMenu = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.preventDefault();
    setAnchorEle?.(e?.target as HTMLElement);
  };
  if (props.row._rowy_outOfOrder)
    return (
      <Fragment key={props.row.id}>
        <OutOfOrderIndicator top={props.top} height={props.height} />
        <Row onContextMenu={handleContextMenu} {...props} />
      </Fragment>
    );

  return <Row onContextMenu={handleContextMenu} {...props} />;
}
