import queryString from "query-string";

import { Hidden } from "@material-ui/core";

import Navigation from "components/Navigation";
import Grid from "components/Grid";
import SideDrawer from "components/SideDrawer";

import { FireTableFilter } from "hooks/useFiretable";
import useRouter from "hooks/useRouter";

export default function GridPage() {
  const router = useRouter();
  const tableCollection = decodeURIComponent(router.match.params.id);

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
      <Grid
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
