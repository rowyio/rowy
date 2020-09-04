import React from "react";
import queryString from "query-string";
import { Link as RouterLink } from "react-router-dom";

import {
  makeStyles,
  createStyles,
  Breadcrumbs as MuiBreadcrumbs,
  Link,
  Typography,
} from "@material-ui/core";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";

import { useFiretableContext } from "contexts/firetableContext";
import useRouter from "hooks/useRouter";
import routes from "constants/routes";
import { DRAWER_COLLAPSED_WIDTH } from "components/SideDrawer";

export const BREADCRUMBS_HEIGHT = 36;

const useStyles = makeStyles((theme) =>
  createStyles({
    ol: {
      height: BREADCRUMBS_HEIGHT,
      alignItems: "flex-end",

      paddingLeft: theme.spacing(2),
      paddingRight: DRAWER_COLLAPSED_WIDTH,
    },

    li: {
      textTransform: "capitalize",
      "&:first-of-type": { textTransform: "uppercase" },
    },
  })
);

export default function Breadcrumbs() {
  const classes = useStyles();

  const { tableState } = useFiretableContext();
  const collection = tableState?.tablePath || "";

  const router = useRouter();
  const parentLabel = decodeURIComponent(
    queryString.parse(router.location.search).parentLabel as string
  );

  const breadcrumbs = collection.split("/");

  return (
    <MuiBreadcrumbs
      separator={<ArrowRightIcon />}
      aria-label="sub-table breadcrumbs"
      classes={classes}
    >
      {breadcrumbs.map((crumb: string, index) => {
        // If it’s the last crumb, just show the label without linking
        if (index === breadcrumbs.length - 1)
          return (
            <Typography variant="caption" color="textSecondary">
              {crumb.replace(/([A-Z])/g, " $1")}
            </Typography>
          );

        // If odd: breadcrumb points to a document — don’t show a link
        // TODO: show a picker here to switch between sub tables
        if (index % 2 === 1)
          return (
            <Typography variant="caption" color="textSecondary">
              {parentLabel.split(",")[Math.ceil(index / 2) - 1] || crumb}
            </Typography>
          );

        // Otherwise, even: breadcrumb points to a Firestore collection
        return (
          <Link
            component={RouterLink}
            to={`${routes.table}/${encodeURIComponent(
              breadcrumbs.slice(0, index + 1).join("/")
            )}`}
            variant="caption"
            color="textSecondary"
          >
            {crumb.replace(/([A-Z])/g, " $1")}
          </Link>
        );
      })}
    </MuiBreadcrumbs>
  );
}
