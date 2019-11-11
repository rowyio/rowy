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
    // encoded
    //%5B%7B%20key:%20%22cohort%22,%20operator:%20%22==%22,%20value:%20%22SYD1%22%20%7D%5D
    // decoded
    //[{key:"cohort",operator:"==",value:"AMS1"}]
    console.log(parsed.filters);
    filters = eval(parsed.filters);
  }

  return (
    <Navigation>
      <Table collection={tableCollection} filters={filters} />
    </Navigation>
  );
}
