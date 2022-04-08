import "./App.css";
import DataGrid from "react-data-grid";
import CloudLogs from "@src/assets/icons/CloudLogs";

const columns = [
  { key: "id", name: "ID" },
  { key: "title", name: "Title" },
];

const rows = [
  { id: 0, title: "Example" },
  { id: 1, title: "Demo" },
];

function App() {
  return (
    <div className="App">
      <DataGrid columns={columns} rows={rows} />

      <CloudLogs />
    </div>
  );
}

export default App;
