import { db } from "../firebase";
import { useEffect, useReducer } from "react";
import equals from "ramda/es/equals";

export type Cell = {
  fieldName: string;
  rowIndex: number;
  docId: string;
  value: any;
};

const cellReducer = (prevState: any, newProps: any) => {
  return { ...prevState, ...newProps };
};
const cellIntialState = {
  prevCell: null,
  cell: null
};

const useCell = (intialOverrides: any) => {
  const [cellState, cellDispatch] = useReducer(cellReducer, {
    ...cellIntialState,
    ...intialOverrides
  });
  useEffect(() => {
    const { prevCell, value, updateCell, updatedValue } = cellState;
    // check for change
    if (updatedValue && prevCell && prevCell.value !== updatedValue) {
      updateCell({ ...prevCell, value: updatedValue });
      cellDispatch({ updatedValue: null });
    }
  }, [cellState.cell]);
  const setCell = (cell: Cell) => {
    cellDispatch({ prevCell: cellState.cell, cell });
  };
  const updateValue = (value: any) => {
    cellDispatch({ updatedValue: value });
  };

  const actions = { setCell, updateValue };

  return [cellState.cell, actions];
};

export default useCell;
