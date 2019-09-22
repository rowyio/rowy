import React, { useEffect } from "react";
import clsx from "clsx";

import { Theme, WithStyles } from "@material-ui/core/styles";
import {
  TableCell as MuiTableCell,
  createStyles,
  withStyles,
  Paper,
  Button,
} from "@material-ui/core";

import {
  AutoSizer,
  Column,
  Table as MuiTable,
  TableCellRenderer,
  TableHeaderProps,
} from "react-virtualized";

import { FieldType, getFieldIcon } from "./Fields";
import ColumnDrawer from "./ColumnDrawer";
import TableCell from "../components/TableCell";

import useCell, { Cell } from "../hooks/useFiretable/useCell";
import useFiretable from "../hooks/useFiretable";

const styles = (theme: Theme) =>
  createStyles({
    flexContainer: {
      display: "flex",
      alignItems: "center",
      boxSizing: "border-box",
    },
    tableRow: {
      cursor: "pointer",
    },
    tableRowHover: {
      "&:hover": {
        backgroundColor: theme.palette.grey[200],
      },
    },
    tableCell: {
      flex: 1,
    },
    noClick: {
      cursor: "initial",
    },
  });

interface ColumnData {
  columnData: any;
  dataKey: string;
  label: string;
  numeric?: boolean;
  width: number;
}

interface Row {
  index: number;
}

interface MuiVirtualizedTableProps extends WithStyles<typeof styles> {
  columns: ColumnData[];
  focusedCell: Cell | null;
  cellActions: any;
  headerHeight?: number;
  onRowClick?: () => void;
  rowCount: number;
  rowGetter: (row: Row) => any;
  rowHeight?: number;
}

class MuiVirtualizedTable extends React.PureComponent<
  MuiVirtualizedTableProps
> {
  static defaultProps = {
    headerHeight: 48,
    rowHeight: 40,
  };

  getRowClassName = ({ index }: Row) => {
    const { classes, onRowClick } = this.props;

    return clsx(classes.tableRow, classes.flexContainer, {
      [classes.tableRowHover]: index !== -1 && onRowClick != null,
    });
  };

  cellRenderer: TableCellRenderer = ({
    cellData,
    columnData,
    columnIndex,
    dataKey,
    isScrolling,
    rowData,
    rowIndex,
  }) => {
    const {
      columns,
      classes,
      rowHeight,
      onRowClick,
      cellActions,
      focusedCell,
    } = this.props;
    const fieldType = columnData.fieldType;
    return (
      <TableCell
        fieldType={fieldType}
        rowIndex={rowIndex}
        rowData={rowData}
        columnData={columnData}
        classes={classes}
        cellActions={cellActions}
        cellData={cellData}
        onRowClick={onRowClick}
        rowHeight={rowHeight}
        columnIndex={columnIndex}
        columns={columns}
        focusedCell={focusedCell}
      />
    );
  };
  headerRenderer = ({
    label,
    columnData,
    dataKey,
    columnIndex,
  }: TableHeaderProps & { columnIndex: number }) => {
    const { headerHeight, columns, classes } = this.props;

    return (
      <MuiTableCell
        component="div"
        className={clsx(
          classes.tableCell,
          classes.flexContainer,
          classes.noClick
        )}
        variant="head"
        style={{ height: headerHeight }}
        align={columns[columnIndex].numeric || false ? "right" : "left"}
      >
        {dataKey === "add" ? (
          <ColumnDrawer
            columns={columns}
            addColumn={columnData.actions.addColumn}
          />
        ) : (
          <Button size="small">
            {getFieldIcon(columnData.fieldType)} {label}
          </Button>
        )}
      </MuiTableCell>
    );
  };

  render() {
    const {
      classes,
      columns,
      rowHeight,
      headerHeight,
      ...tableProps
    } = this.props;
    return (
      <AutoSizer>
        {({ height, width }) => (
          <>
            <MuiTable
              height={height}
              width={width}
              rowHeight={rowHeight!}
              headerHeight={headerHeight!}
              {...tableProps}
              rowClassName={this.getRowClassName}
            >
              {[
                ...columns.map(({ dataKey, ...other }, index) => {
                  return (
                    <Column
                      key={dataKey}
                      headerRenderer={headerProps =>
                        this.headerRenderer({
                          ...headerProps,
                          columnIndex: index,
                        })
                      }
                      className={classes.flexContainer}
                      cellRenderer={this.cellRenderer}
                      dataKey={dataKey}
                      {...other}
                    />
                  );
                }),
              ]}
            </MuiTable>
          </>
        )}
      </AutoSizer>
    );
  }
}

const VirtualizedTable = withStyles(styles)(MuiVirtualizedTable);

// TODO: Create an interface for props
export default function Table(props: any) {
  const { collection } = props;
  const { tableState, tableActions } = useFiretable(collection);

  useEffect(() => {
    tableActions.table.set(collection);
  }, [collection]);

  if (tableState.columns)
    return (
      <>
        <Paper style={{ height: 400, width: "100%" }}>
          <VirtualizedTable
            focusedCell={tableState.cell}
            cellActions={tableActions.cell}
            rowCount={tableState.rows.length}
            rowGetter={({ index }) => tableState.rows[index]}
            columns={[
              ...tableState.columns.map(
                (column: {
                  fieldName: string;
                  columnName: string;
                  type: FieldType;
                }) => ({
                  width: 200,
                  label: column.columnName,
                  dataKey: column.fieldName,
                  columnData: {
                    fieldType: column.type,
                    fieldName: column.fieldName,
                    actions: {},
                  },
                })
              ),
              {
                width: 80,
                label: "add",
                dataKey: "add",
                columnData: {
                  fieldType: "DELETE",
                  actions: {
                    addColumn: tableActions.column.add,
                    deleteRow: tableActions.row.delete,
                  },
                },
              },
            ]}
          />
        </Paper>
        <Button onClick={tableActions.row.add}>Add Row</Button>
      </>
    );
  else return <>insert loading Skeleton here</>;
}
