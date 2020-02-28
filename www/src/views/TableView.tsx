import React from "react";
import queryString from "query-string";

import { Hidden } from "@material-ui/core";

import Navigation from "components/Navigation";
import Table from "components/Table";
import SideDrawer from "components/SideDrawer";

import { FireTableFilter } from "hooks/useFiretable";
import useRouter from "hooks/useRouter";

export default function TableView() {
  const router = useRouter();
  const tableCollection = decodeURIComponent(
    router.location.pathname.split("/")[2]
  );

  let filters: FireTableFilter[] = [];
  const parsed = queryString.parse(router.location.search);
  if (typeof parsed.filters === "string") {
    // decoded
    //[{"key":"cohort","operator":"==","value":"AMS1"}]
    filters = JSON.parse(parsed.filters);
    //TODO: json schema validator
  }

  return (
    <Navigation tableCollection={tableCollection}>
      <Table
        key={tableCollection}
        collection={tableCollection}
        filters={filters}
      />

      <Hidden smDown>
        <SideDrawer />
      </Hidden>
    </Navigation>
  );
}
