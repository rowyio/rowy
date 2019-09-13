import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";

import Navigation from "../components/Navigation";
import useTable from "../hooks/useTable";
import Table from "../components/Table";
import useRouter from "../hooks/useRouter";
import useTableConfig from "../hooks/useTableConfig";
import Button from "@material-ui/core/Button";
import useFiretable from "../hooks/useFiretable";
const useStyles = makeStyles({});

export default function AuthView() {
  const router = useRouter();
  const tableCollection = router.location.pathname.split("/")[2];

  const classes = useStyles();

  return (
    <Navigation header={tableCollection}>
      <Table collection={tableCollection} />
    </Navigation>
  );
}
