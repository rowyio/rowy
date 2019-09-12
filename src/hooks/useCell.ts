import { db } from "../firebase";
import { useEffect, useReducer } from "react";
import equals from "ramda/es/equals";

export type Cell = {
  fieldName: string;
  rowIndex: number;
  docId: string;
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

  const setCell = (cell: Cell) => {
    cellDispatch({ prevCell: cellState.cell, cell });
  };
  const actions = { setCell };
  return [cellState.cell, actions];
};

export default useCell;
