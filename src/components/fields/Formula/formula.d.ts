type RowRef<T> = { id: string; path: string; parent: T };
interface Ref extends RowRef<Ref> {}

type FormulaContext = {
  row: Row;
  ref: Ref;
};

type Formula = (context: FormulaContext) => "PLACEHOLDER_OUTPUT_TYPE";
