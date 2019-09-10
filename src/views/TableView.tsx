import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import { Navigation } from "../components/Navigation";
import useTable from "../hooks/useTable";
import Table from "../components/Table";

import useTableConfig from "../hooks/useTableConfig";
const useStyles = makeStyles({});

export default function AuthView() {
  const classes = useStyles();
  const tableConfig = useTableConfig("founders");
  const [table] = useTable({ path: "founders" });
  return (
    <Navigation>
      <Table columns={tableConfig.columns} rows={table.rows} />
    </Navigation>
  );
}
