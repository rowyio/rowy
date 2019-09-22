import { db } from "../../firebase";
import { useEffect, useReducer } from "react";
import equals from "ramda/es/equals";

export type Cell = {
  fieldName: string;
  rowIndex: number;
  docRef: firebase.firestore.DocumentReference;
  value: any;
};

const cellReducer = (prevState: any, newProps: any) => {
  return { ...prevState, ...newProps };
};
const cellIntialState = {
  prevCell: null,
  cell: null,
};

const updateCell = (cell: Cell) => {
  cell.docRef.update({ [cell.fieldName]: cell.value });
};
const useCell = (intialOverrides: any) => {
  const [cellState, cellDispatch] = useReducer(cellReducer, {
    ...cellIntialState,
    ...intialOverrides,
  });
  useEffect(() => {
    const { prevCell, updatedValue } = cellState;
    // check for change
    if (
      updatedValue !== null &&
      updatedValue !== undefined &&
      prevCell &&
      prevCell.value !== updatedValue
    ) {
      updateCell({ ...prevCell, value: updatedValue });
      cellDispatch({ updatedValue: null });
    }
  }, [cellState.cell]);
  const set = (cell: Cell | null) => {
    cellDispatch({ prevCell: cellState.cell, cell });
  };
  const update = (value: any) => {
    cellDispatch({ updatedValue: value });
  };

  const updateFirestore = (cell: Cell) => {
    cellDispatch({ cell: null });
    updateCell(cell);
  };
  const actions = { set, update, updateFirestore };

  return [cellState, actions];
};

export default useCell;
