import React from "react";
import queryString from "query-string";
import Navigation from "../components/Navigation";
import Table from "../components/Table";

import { FireTableFilter } from "../hooks/useFiretable";

import useRouter from "../hooks/useRouter";

export default function TableView() {
  const router = useRouter();
  const tableCollection = router.location.pathname.split("/")[2];
  let filters: FireTableFilter[] = [];
  const parsed = queryString.parse(router.location.search);
  if (typeof parsed.filters === "string") {
    // decoded
    //[{"key":"cohort","operator":"==","value":"AMS1"}]
    filters = JSON.parse(parsed.filters);
    //TODO: json schema validator
  }

  return (
    <Navigation>
      <Table collection={tableCollection} filters={filters} />
    </Navigation>
  );
}
