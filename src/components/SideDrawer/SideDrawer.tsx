import { useEffect } from "react";
import clsx from "clsx";
import { useAtom } from "jotai";
import { find, findIndex } from "lodash-es";
import { ErrorBoundary } from "react-error-boundary";
import { TransitionGroup } from "react-transition-group";

import { Fab, Fade } from "@mui/material";
import ChevronIcon from "@mui/icons-material/KeyboardArrowLeft";
import ChevronUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ChevronDownIcon from "@mui/icons-material/KeyboardArrowDown";

import ErrorFallback from "@src/components/ErrorFallback";
import StyledDrawer from "./StyledDrawer";
import SideDrawerFields from "./SideDrawerFields";

import {
  tableScope,
  tableRowsAtom,
  sideDrawerOpenAtom,
  selectedCellAtom,
} from "@src/atoms/tableScope";
import { analytics, logEvent } from "@src/analytics";

export const DRAWER_WIDTH = 512;
export const DRAWER_COLLAPSED_WIDTH = 36;

export default function SideDrawer() {
  const [tableRows] = useAtom(tableRowsAtom, tableScope);

  const [cell, setCell] = useAtom(selectedCellAtom, tableScope);
  const [open, setOpen] = useAtom(sideDrawerOpenAtom, tableScope);
  const selectedRow = find(
    tableRows,
    cell?.arrayIndex === undefined
      ? ["_rowy_ref.path", cell?.path]
      : // if the table is an array table, we need to use the array index to find the row
        ["_rowy_ref.arrayTableData.index", cell?.arrayIndex]
  );

  const selectedCellRowIndex = findIndex(
    tableRows,
    cell?.arrayIndex === undefined
      ? ["_rowy_ref.path", cell?.path]
      : // if the table is an array table, we need to use the array index to find the row
        ["_rowy_ref.arrayTableData.index", cell?.arrayIndex]
  );

  const handleNavigate = (direction: "up" | "down") => () => {
    if (!tableRows || !cell) return;
    let rowIndex = selectedCellRowIndex;
    if (direction === "up" && rowIndex > 0) rowIndex -= 1;
    if (direction === "down" && rowIndex < tableRows.length - 1) rowIndex += 1;
    const newPath = tableRows[rowIndex]._rowy_ref.path;

    setCell((cell) => ({
      columnKey: cell!.columnKey,
      path: cell?.arrayIndex !== undefined ? cell.path : newPath,
      focusInside: false,
      arrayIndex: cell?.arrayIndex !== undefined ? rowIndex : undefined,
    }));
  };

  // const [urlDocState, dispatchUrlDoc] = useDoc({});

  // useEffect(() => {
  //   setOpen(false);
  //   dispatchUrlDoc({ path: "", doc: null });
  // }, [window.location.pathname]);

  // useEffect(() => {
  //   const rowRef = queryString.parse(window.location.search).rowRef as string;
  //   if (rowRef) dispatchUrlDoc({ path: decodeURIComponent(rowRef) });
  // }, []);

  // useEffect(() => {
  //   if (cell && tableState?.rows[cell.row]) {
  //     if (urlDocState.doc) {
  //       urlDocState.unsubscribe();
  //       dispatchUrlDoc({ path: "", doc: null });
  //     }
  //   }
  // }, [cell]);

  const disabled = (!open && !cell) || selectedCellRowIndex <= -1; // && !urlDocState.doc;
  useEffect(() => {
    if (disabled && setOpen) setOpen(false);
  }, [disabled, setOpen]);

  return (
    <StyledDrawer
      className={clsx(
        open && "sidedrawer-open",
        disabled && "sidedrawer-disabled"
      )}
      variant="permanent"
      anchor="right"
      PaperProps={
        { elevation: 4, component: "aside", "aria-label": "Side drawer" } as any
      }
    >
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <div className="sidedrawer-contents">
          <TransitionGroup>
            {open && cell && selectedRow && (
              <Fade>
                <div>
                  <SideDrawerFields key={cell.path} row={selectedRow} />
                </div>
              </Fade>
            )}
          </TransitionGroup>
        </div>
      </ErrorBoundary>

      {!!cell && (
        <div className="sidedrawer-nav-fab-container">
          <Fab
            aria-label="Previous row"
            style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
            size="small"
            disabled={disabled || !cell || selectedCellRowIndex <= 0}
            onClick={handleNavigate("up")}
          >
            <ChevronUpIcon />
          </Fab>

          <Fab
            aria-label="Next row"
            style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
            size="small"
            disabled={
              disabled || !cell || selectedCellRowIndex >= tableRows.length - 1
            }
            onClick={handleNavigate("down")}
          >
            <ChevronDownIcon />
          </Fab>
        </div>
      )}

      <div className="sidedrawer-open-fab-container">
        <Fab
          aria-label={open ? "Close side drawer" : "Open side drawer"}
          disabled={disabled}
          onClick={() => {
            if (setOpen)
              setOpen((o) => {
                logEvent(
                  analytics,
                  o ? "side_drawer_close" : "side_drawer_open"
                );
                return !o;
              });
          }}
          sx={{ transform: disabled ? "scale(0)" : "none" }}
        >
          <ChevronIcon
            sx={{
              transition: (theme) =>
                theme.transitions.create("transform", {
                  easing: theme.transitions.easing.easeInOut,
                  duration: theme.transitions.duration.standard,
                }),
              transform: open ? "rotate(180deg)" : "none",
            }}
          />
        </Fab>
      </div>
    </StyledDrawer>
  );
}
