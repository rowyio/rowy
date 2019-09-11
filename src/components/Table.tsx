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
  Table,
  TableCellRenderer,
  TableHeaderProps
} from "react-virtualized";
import Button from "@material-ui/core/Button";

//  import { TextField } from "@material-ui/core";
import { FieldType, getFieldIcon } from "../Fields";
import ColumnDrawer from "./ColumnDrawer";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
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
    const { columns, classes, rowHeight, onRowClick } = this.props;
    const fieldType = columnData.fieldType;
    if (fieldType === "DELETE")
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

    return (
      <TableCell
        component="div"
        className={clsx(classes.tableCell, classes.flexContainer, {
          [classes.noClick]: onRowClick == null
        })}
        variant="body"
        onClick={() => {
          console.log(rowIndex, rowData.id, columnData.fieldName);
        }}
        style={{ height: rowHeight }}
        align={
          (columnIndex != null && columns[columnIndex].numeric) || false
            ? "right"
            : "left"
        }
      >
        {cellData} {}
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
          <Table
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
          </Table>
        )}
      </AutoSizer>
    );
  }
}

const VirtualizedTable = withStyles(styles)(MuiVirtualizedTable);

export default function fTable(props: any) {
  const { columns, rows, addColumn, deleteRow } = props;
  //  const [focus, setFocus] = useState(false);
  if (columns)
    return (
      <Paper style={{ height: 400, width: "100%" }}>
        <VirtualizedTable
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
                actions: { addColumn, deleteRow }
              }
            }
          ]}
        />
      </Paper>
    );
  else return <>insert loading Skeleton here</>;
}
