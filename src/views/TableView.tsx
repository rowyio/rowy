import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import { Navigation } from "../components/Navigation";
import useTable from "../hooks/useTable";
import Table from "../components/Table";
import useRouter from "../hooks/useRouter";
import useTableConfig from "../hooks/useTableConfig";
const useStyles = makeStyles({});

export default function AuthView() {
  const router = useRouter();
  const tableCollection = router.location.pathname.split("/")[2];
  console.log(tableCollection);
  const classes = useStyles();
  const tableConfig = useTableConfig(tableCollection);
  const [table] = useTable({ path: tableCollection });
  return (
    <Navigation>
      <Table columns={tableConfig.columns} rows={table.rows} />
    </Navigation>
  );
}
