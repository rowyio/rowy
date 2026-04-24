import { Provider } from "jotai";
import {
  tableScope,
  tableIdAtom,
  tableRowsAtom,
  tableSchemaAtom,
  tableColumnsOrderedAtom,
} from "@src/atoms/tableScope";
import Table from "@src/components/Table";

const mockRows: any[] = [
  { _rowy_ref: { id: "1", path: "test/1" }, name: "Alice", value: 10 },
  { _rowy_ref: { id: "2", path: "test/2" }, name: "Bob", value: 20 },
  { _rowy_ref: { id: "3", path: "test/3" }, name: "Charlie", value: 30 },
];

const mockColumns: any[] = [
  {
    key: "name",
    id: "name",
    fieldName: "name",
    label: "Name",
    type: "shortText",
    index: 0,
    width: 200,
    config: {},
  },
  {
    key: "value",
    id: "value",
    fieldName: "value",
    label: "Value",
    type: "number",
    index: 1,
    width: 200,
    config: {},
  },
];

const mockSchema = {
  columns: {
    name: mockColumns[0],
    value: mockColumns[1],
  },
};

export default function DirectTableTestPage() {
  return (
    <Provider
      scope={tableScope}
      initialValues={[
        [tableIdAtom, "test"],
        [tableRowsAtom, mockRows],
        [tableSchemaAtom, mockSchema],
        [tableColumnsOrderedAtom, mockColumns],
      ]}
    >
      <div style={{ height: "100vh" }}>
        <Table />
      </div>
    </Provider>
  );
}
