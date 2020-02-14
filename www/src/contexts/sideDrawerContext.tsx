import React, { useContext, useState } from "react";

import { IGridProps } from "components/Table/Grid";

type Columns = IGridProps["columns"] | null;
type SelectedCell = { row?: any; column?: any } | null;

type SideDrawerContextProps = {
  columns: Columns;
  setColumns: React.Dispatch<React.SetStateAction<Columns>>;

  selectedCell: SelectedCell;
  setSelectedCell: React.Dispatch<React.SetStateAction<SelectedCell>>;
};

const SideDrawerContext = React.createContext<Partial<SideDrawerContextProps>>(
  {}
);
export default SideDrawerContext;

export const useSideDrawerContext = () => useContext(SideDrawerContext);

export const SideDrawerProvider: React.FC = ({ children }) => {
  const [columns, setColumns] = useState<Columns>(null);
  const [selectedCell, setSelectedCell] = useState<SelectedCell>(null);

  return (
    <SideDrawerContext.Provider
      value={{ columns, setColumns, selectedCell, setSelectedCell }}
    >
      {children}
    </SideDrawerContext.Provider>
  );
};
