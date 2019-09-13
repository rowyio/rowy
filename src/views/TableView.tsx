import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";

import Navigation from "../components/Navigation";
import Table from "../components/Table";
import useRouter from "../hooks/useRouter";
const useStyles = makeStyles({});

export default function TableView() {
  const router = useRouter();
  const tableCollection = router.location.pathname.split("/")[2];
  const classes = useStyles();

  return (
    <Navigation header={tableCollection}>
      <Table collection={tableCollection} />
    </Navigation>
  );
}
