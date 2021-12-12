import { IMenuModalProps } from ".";
import React, { useEffect, useState } from "react";

import _orderBy from "lodash/orderBy";
import _sortBy from "lodash/sortBy";
import DataGrid, { Column, Row, RowRendererProps } from "react-data-grid";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import Modal from "@src/components/Modal";
import { useProjectContext } from "@src/contexts/ProjectContext";
import useCombinedRefs from "@src/hooks/useCombinedRefs";

type DataGridColumn = Column<any> & {
  [key: string]: any;
};
export default function ArrangeColumn({ open, handleClose }: IMenuModalProps) {
  const { tableState, tableActions } = useProjectContext();
  const [arr, setArr] = useState<DataGridColumn[]>([]);
  const columns = [
    {
      key: "index",
      name: "Order",
      type: "Arrange_Column",
      index: 0,
      width: 90,
      headerCellClass: "arrange-column-index-header",
      cellClass: "arrange-column-index-cell",
      editable: false,
    },
    {
      key: "name",
      name: "Column Name",
      type: "Arrange_Column",
      index: 0,
      width: 220,
      headerCellClass: "arrange-column-name-header",
      cellClass: "arrange-column-name-cell",
      editable: false,
    },
  ];

  const handleArrangeColumn = () => tableActions?.column.arrange(arr);

  useEffect(() => {
    if (!tableState?.loadingColumns && tableState?.columns) {
      const _rows: DataGridColumn[] = _orderBy(
        Object.values(tableState?.columns!),
        "index"
      );
      setArr(_rows);
    }
  }, [tableState?.loadingColumns, tableState?.columns]);

  if (!open) return null;
  return (
    <Modal
      onClose={handleClose}
      title="Arrange Columns"
      maxWidth="xs"
      children={
        <DndProvider backend={HTML5Backend}>
          <Container arr={arr} setArr={setArr} columns={columns} />
        </DndProvider>
      }
      actions={{
        primary: {
          onClick: () => {
            handleArrangeColumn();
            handleClose();
          },
          children: "Arrange",
        },
        secondary: {
          onClick: handleClose,
          children: "Cancel",
        },
      }}
    />
  );
}

interface IContainer {
  arr: DataGridColumn[];
  columns: DataGridColumn[];
  setArr: React.Dispatch<React.SetStateAction<DataGridColumn[]>>;
}

function Container({ arr, columns, setArr }: IContainer) {
  function arrangeRow(sourceIndex: number, targetIndex: number) {
    if (arr.length <= 1) return;
    const newArr: any = Array.from(
      arr.map((row, index) => {
        if (index === sourceIndex) return { ...arr[targetIndex], index };
        if (index === targetIndex) return { ...arr[sourceIndex], index };
        return row;
      })
    );
    setArr(newArr);
  }

  function MyRowRenderer(props: RowRendererProps<typeof Row>) {
    const [{ isDragging }, drag] = useDrag({
      item: { type: "ROW_DRAG", cellIndex: props.rowIdx },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    });

    const [{ isOver }, drop] = useDrop({
      accept: "ROW_DRAG",
      drop: ({ cellIndex }: any) => arrangeRow(cellIndex, props.rowIdx),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    });

    const ref = useCombinedRefs(drag, drop);

    return <Row ref={ref} {...props} />;
  }

  return (
    <DataGrid
      className="rdg-light"
      rows={arr}
      columns={columns}
      rowRenderer={MyRowRenderer}
    />
  );
}
