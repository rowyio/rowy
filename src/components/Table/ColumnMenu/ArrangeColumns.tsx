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

export type DataGridColumn = Column<any> & {
  [key: string]: any;
};

export type DataGridRow = {
  [key: string]: any;
};

export default function ArrangeColumn({ open, handleClose }: IMenuModalProps) {
  const { tableState, tableActions } = useProjectContext();
  const [rows, setRows] = useState<DataGridRow[]>([]);
  const columns: DataGridColumn[] = [
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

  const handleReArrange = () => tableActions?.column.arrange(rows);

  /**
   *  Note: Covert Columns into row format for re arrangement
   */
  useEffect(() => {
    if (tableState?.loadingColumns && !tableState?.columns) return;
    const _rows: any = _orderBy(Object.values(tableState?.columns!), "index");
    setRows(_rows);
  }, [tableState?.loadingColumns, tableState?.columns]);

  if (!open) return null;
  return (
    <Modal
      onClose={handleClose}
      title="Arrange Columns"
      maxWidth="xs"
      children={
        <DndProvider backend={HTML5Backend}>
          <Container rows={rows} setRows={setRows} columns={columns} />
        </DndProvider>
      }
      actions={{
        primary: {
          onClick: () => {
            handleReArrange();
            handleClose();
          },
          children: "Update",
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
  columns: DataGridColumn[];
  rows: DataGridRow[];
  setRows: React.Dispatch<React.SetStateAction<DataGridRow[]>>;
}

function Container({ columns, rows, setRows }: IContainer) {
  function arrangeRow(sourceIndex: number, targetIndex: number) {
    if (rows.length <= 1) return;
    const newArr: any = rows.map((row, index) => {
      if (index === sourceIndex) return { ...rows[targetIndex], index };
      if (index === targetIndex) return { ...rows[sourceIndex], index };
      return row;
    });
    setRows(newArr);
  }

  function MyRowRenderer(props: RowRendererProps<DataGridRow>) {
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

  return <DataGrid rows={rows} columns={columns} rowRenderer={MyRowRenderer} />;
}
