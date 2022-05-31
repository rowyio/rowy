import React, { useState, useEffect } from "react";
import clsx from "clsx";
import _isNil from "lodash/isNil";
import _isEmpty from "lodash/isEmpty";
import queryString from "query-string";

import { Drawer, Fab } from "@mui/material";
import ChevronIcon from "@mui/icons-material/KeyboardArrowLeft";
import ChevronUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ChevronDownIcon from "@mui/icons-material/KeyboardArrowDown";

import Form from "./Form";
import ErrorBoundary from "@src/components/ErrorBoundary";

import { useStyles } from "./useStyles";
import { useProjectContext } from "@src/contexts/ProjectContext";
import useDoc from "@src/hooks/useDoc";
import { analytics } from "@src/analytics";

export const DRAWER_WIDTH = 512;
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
  const { tableState, dataGridRef, sideDrawerRef } = useProjectContext();

  const [cell, setCell] = useState<SelectedCell>(null);
  const [open, setOpen] = useState(false);
  if (sideDrawerRef) sideDrawerRef.current = { cell, setCell, open, setOpen };

  const handleNavigate = (direction: "up" | "down") => () => {
    if (!tableState?.rows) return;
    let row = cell!.row;
    if (direction === "up" && row > 0) row -= 1;
    if (direction === "down" && row < tableState.rows.length - 1) row += 1;
    setCell!((cell) => ({ column: cell!.column, row }));
    const idx = tableState?.columns[cell!.column]?.index;
    dataGridRef?.current?.selectCell({ rowIdx: row, idx }, false);
  };

  const [urlDocState, dispatchUrlDoc] = useDoc({});

  useEffect(() => {
    setOpen(false);
    dispatchUrlDoc({ path: "", doc: null });
  }, [window.location.pathname]);

  useEffect(() => {
    const rowRef = queryString.parse(window.location.search).rowRef as string;
    if (rowRef) dispatchUrlDoc({ path: decodeURIComponent(rowRef) });
  }, []);

  const disabled = !open && (!cell || _isNil(cell.row)) && !urlDocState.doc;
  useEffect(() => {
    if (disabled && setOpen) setOpen(false);
  }, [disabled]);

  useEffect(() => {
    if (cell && tableState?.rows[cell.row]) {
      if (urlDocState.doc) {
        urlDocState.unsubscribe();
        dispatchUrlDoc({ path: "", doc: null });
      }
    }
  }, [cell]);

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
        PaperProps={{ elevation: 4 }}
      >
        <ErrorBoundary>
          <div className={classes.drawerContents}>
            {open &&
              (urlDocState.doc || cell) &&
              !_isEmpty(tableState?.columns) && (
                <Form
                  key={`${cell?.row}-${urlDocState.path}`}
                  values={
                    urlDocState.doc ?? tableState?.rows[cell?.row ?? -1] ?? {}
                  }
                />
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
              // color="secondary"
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
              // color="secondary"
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
            // color="secondary"
            disabled={disabled}
            onClick={() => {
              if (setOpen)
                setOpen((o) => {
                  analytics.logEvent(
                    o ? "side_drawer_close" : "side_drawer_open"
                  );
                  return !o;
                });
            }}
          >
            <ChevronIcon className={classes.drawerFabIcon} />
          </Fab>
        </div>
      </Drawer>
    </div>
  );
}
