import React, { useState } from "react";
import clsx from "clsx";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";
import TableCell from "@material-ui/core/TableCell";
import Paper from "@material-ui/core/Paper";
import {
  AutoSizer,
  Column,
  Table as MuiTable,
  TableCellRenderer,
  TableHeaderProps
} from "react-virtualized";
import Button from "@material-ui/core/Button";

import TextField from "@material-ui/core/TextField";
import { FieldType, getFieldIcon } from "../Fields";
import ColumnDrawer from "./ColumnDrawer";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/AddCircle";
import useCell, { Cell } from "../hooks/useCell";
const styles = (theme: Theme) =>
  createStyles({
    flexContainer: {
      display: "flex",
      alignItems: "center",
      boxSizing: "border-box"
    },
    tableRow: {
      cursor: "pointer"
    },
    tableRowHover: {
      "&:hover": {
        backgroundColor: theme.palette.grey[200]
      }
    },
    tableCell: {
      flex: 1
    },
    noClick: {
      cursor: "initial"
    }
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
    rowHeight: 48
  };

  getRowClassName = ({ index }: Row) => {
    const { classes, onRowClick } = this.props;

    return clsx(classes.tableRow, classes.flexContainer, {
      [classes.tableRowHover]: index !== -1 && onRowClick != null
    });
  };

  cellRenderer: TableCellRenderer = ({
    cellData,
    columnData,
    columnIndex,
    dataKey,
    isScrolling,
    rowData,
    rowIndex
  }) => {
    const {
      columns,
      classes,
      rowHeight,
      onRowClick,
      cellActions,
      focusedCell
    } = this.props;
    const fieldType = columnData.fieldType;
    if (fieldType === "DELETE" && rowData.id !== "new")
      return (
        <IconButton
          aria-label="delete"
          onClick={() => {
            columnData.actions.deleteRow(rowIndex, rowData.id);
          }}
        >
          <DeleteIcon />
        </IconButton>
      );
    else if (fieldType === "DELETE" && rowData.id === "new") {
      return (
        <IconButton
          aria-label="delete"
          onClick={() => {
            columnData.actions.deleteRow(rowIndex, rowData.id);
          }}
        >
          <AddIcon />
        </IconButton>
      );
    }
    return (
      <TableCell
        component="div"
        className={clsx(classes.tableCell, classes.flexContainer, {
          [classes.noClick]: onRowClick == null
        })}
        variant="body"
        onClick={() => {
          cellActions.setCell({
            rowIndex,
            docId: rowData.id,
            fieldName: columnData.fieldName,
            value: cellData
          });
        }}
        style={{ height: rowHeight }}
        align={
          (columnIndex != null && columns[columnIndex].numeric) || false
            ? "right"
            : "left"
        }
      >
        {focusedCell &&
        focusedCell.fieldName === columnData.fieldName &&
        focusedCell.rowIndex === rowIndex ? (
          <TextField
            defaultValue={cellData}
            onChange={e => {
              cellActions.updateValue(e.target.value);
            }}
          />
        ) : (
          cellData
        )}
      </TableCell>
    );
  };

  headerRenderer = ({
    label,
    columnData,
    dataKey,
    columnIndex
  }: TableHeaderProps & { columnIndex: number }) => {
    const { headerHeight, columns, classes } = this.props;

    return (
      <TableCell
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
          <ColumnDrawer addColumn={columnData.actions.addColumn} />
        ) : (
          <Button size="small">
            {getFieldIcon(columnData.fieldType)} {label}
          </Button>
        )}
      </TableCell>
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
                          columnIndex: index
                        })
                      }
                      className={classes.flexContainer}
                      cellRenderer={this.cellRenderer}
                      dataKey={dataKey}
                      {...other}
                    />
                  );
                })
              ]}
            </MuiTable>
          </>
        )}
      </AutoSizer>
    );
  }
}

const VirtualizedTable = withStyles(styles)(MuiVirtualizedTable);

export default function Table(props: any) {
  const { columns, rows, addColumn, tableActions } = props;

  const [cell, cellActions] = useCell({ updateCell: tableActions.updateCell });
  if (columns)
    return (
      <Paper style={{ height: 400, width: "100%" }}>
        <VirtualizedTable
          focusedCell={cell}
          cellActions={cellActions}
          rowCount={rows.length}
          rowGetter={({ index }) => rows[index]}
          columns={[
            ...columns.map(
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
                  actions: {}
                }
              })
            ),
            {
              width: 80,
              label: "add",
              dataKey: "add",
              columnData: {
                fieldType: "DELETE",
                actions: {
                  addColumn: addColumn,
                  deleteRow: tableActions.deleteRow
                }
              }
            }
          ]}
        />
        <Button onClick={tableActions.addRow}>Add Row</Button>
      </Paper>
    );
  else return <>insert loading Skeleton here</>;
}
