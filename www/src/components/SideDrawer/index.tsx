import React, { useState, useEffect } from "react";
import clsx from "clsx";
import _isNil from "lodash/isNil";
import _sortBy from "lodash/sortBy";
import _findIndex from "lodash/findIndex";

import { Drawer, Fab } from "@material-ui/core";
import ChevronIcon from "@material-ui/icons/KeyboardArrowLeft";
import ChevronUpIcon from "@material-ui/icons/KeyboardArrowUp";
import ChevronDownIcon from "@material-ui/icons/KeyboardArrowDown";

import Form, { Field } from "./Form";
import ErrorBoundary from "components/ErrorBoundary";

import { useStyles } from "./useStyles";
import { useFiretableContext } from "contexts/firetableContext";
import { FieldType } from "constants/fields";

export const DRAWER_WIDTH = 600;
export const DRAWER_COLLAPSED_WIDTH = 36;

type SelectedCell = { row: number; column: string } | null;
export type SideDrawerRef = {
  cell: SelectedCell;
  setCell: React.Dispatch<React.SetStateAction<SelectedCell>>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function SideDrawer() {
  const classes = useStyles();
  const { tableState, dataGridRef, sideDrawerRef } = useFiretableContext();

  const [cell, setCell] = useState<SelectedCell>(null);
  const [open, setOpen] = useState(false);
  if (sideDrawerRef) sideDrawerRef.current = { cell, setCell, open, setOpen };

  const disabled = !cell || _isNil(cell.row);
  useEffect(() => {
    if (disabled && setOpen) setOpen(false);
  }, [disabled]);

  const handleNavigate = (direction: "up" | "down") => () => {
    if (!tableState?.rows) return;

    let row = cell!.row;
    if (direction === "up" && row > 0) row -= 1;
    if (direction === "down" && row < tableState.rows.length - 1) row += 1;

    setCell!(cell => ({ column: cell!.column, row }));

    const idx = _findIndex(tableState?.columns, ["key", cell!.column]);
    dataGridRef?.current?.selectCell({ rowIdx: row, idx });
  };

  // Map columns to form fields

  const fields =
    tableState?.columns &&
    (Array.isArray(tableState?.columns)
      ? tableState?.columns
      : _sortBy(Object.values(tableState?.columns), "index")
    ).map(column => {
      const field: Field = {
        type: column.type,
        name: column.key,
        label: column.name,
      };

      switch (column.type) {
        case FieldType.longText:
          field.fieldVariant = "long";
          break;

        case FieldType.email:
          field.fieldVariant = "email";
          break;

        case FieldType.phone:
          field.fieldVariant = "phone";
          break;

        case FieldType.number:
          field.fieldVariant = "number";
          break;

        case FieldType.singleSelect:
        case FieldType.multiSelect:
        case FieldType.connectTable:
        case FieldType.subTable:
        case FieldType.action:
          field.config = column.config;
          break;

        default:
          break;
      }
      field.editable = column.editable;
      return field;
    });

  return (
    <div className={clsx(open && classes.open, disabled && classes.disabled)}>
      <Drawer
        variant="permanent"
        anchor="right"
        className={classes.drawer}
        classes={{
          paperAnchorDockedRight: clsx(
            classes.paper,
            !disabled && classes.bumpPaper
          ),
          paper: clsx({ [classes.paperClose]: !open }),
        }}
      >
        <ErrorBoundary>
          <div className={classes.drawerContents}>
            {open && fields && cell && (
              <Form fields={fields} values={tableState?.rows[cell.row] ?? {}} />
            )}
          </div>
        </ErrorBoundary>

        {open && (
          <div className={classes.navFabContainer}>
            <Fab
              classes={{
                root: clsx(classes.fab, classes.navFab),
                disabled: classes.disabled,
              }}
              style={{ animationDelay: "0.2s" }}
              color="secondary"
              size="small"
              disabled={disabled || !cell || cell.row <= 0}
              onClick={handleNavigate("up")}
            >
              <ChevronUpIcon />
            </Fab>

            <Fab
              classes={{
                root: clsx(classes.fab, classes.navFab),
                disabled: classes.disabled,
              }}
              style={{ animationDelay: "0.1s" }}
              color="secondary"
              size="small"
              disabled={
                disabled ||
                !tableState ||
                !cell ||
                cell.row >= tableState.rows.length - 1
              }
              onClick={handleNavigate("down")}
            >
              <ChevronDownIcon />
            </Fab>
          </div>
        )}

        <div className={classes.drawerFabContainer}>
          <Fab
            classes={{ root: classes.fab, disabled: classes.disabled }}
            color="secondary"
            disabled={disabled}
            onClick={() => {
              if (setOpen) setOpen(o => !o);
            }}
          >
            <ChevronIcon className={classes.drawerFabIcon} />
          </Fab>
        </div>
      </Drawer>
    </div>
  );
}
