import _find from "lodash/find";
import queryString from "query-string";
import { Link as RouterLink } from "react-router-dom";

import {
  makeStyles,
  createStyles,
  Breadcrumbs as MuiBreadcrumbs,
  BreadcrumbsProps,
  Link,
  Typography,
} from "@material-ui/core";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";

import { useFiretableContext } from "contexts/FiretableContext";
import useRouter from "hooks/useRouter";
import routes from "constants/routes";
import { DRAWER_COLLAPSED_WIDTH } from "components/SideDrawer";

const useStyles = makeStyles((theme) =>
  createStyles({
    ol: {
      alignItems: "baseline",

      paddingLeft: theme.spacing(2),
      paddingRight: DRAWER_COLLAPSED_WIDTH,

      userSelect: "none",
    },

    li: {
      display: "flex",
      alignItems: "center",

      textTransform: "capitalize",
      "&:first-of-type": { textTransform: "uppercase" },
    },

    separator: {
      alignSelf: "flex-end",
      marginBottom: -2,
    },
  })
);

export default function Breadcrumbs(props: BreadcrumbsProps) {
  const classes = useStyles();

  const { tables, tableState } = useFiretableContext();
  const collection = tableState?.tablePath || "";

  const router = useRouter();
  const parentLabel = decodeURIComponent(
    queryString.parse(router.location.search).parentLabel as string
  );

  const breadcrumbs = collection.split("/");

  const section = _find(tables, ["collection", breadcrumbs[0]])?.section || "";
  const getLabel = (collection: string) =>
    _find(tables, ["collection", collection])?.name || collection;

  return (
    <MuiBreadcrumbs
      separator={<ArrowRightIcon />}
      aria-label="sub-table breadcrumbs"
      classes={classes}
      component="div"
      {...(props as any)}
    >
      {/* Section name */}
      {section && (
        <Link
          component={RouterLink}
          to={`${routes.home}#${section}`}
          variant="h6"
          color="textPrimary"
        >
          {section}
        </Link>
      )}

      {breadcrumbs.map((crumb: string, index) => {
        // If it’s the first breadcrumb, show with specific style
        const crumbProps = {
          key: index,
          variant: index === 0 ? "h6" : "subtitle2",
          component: index === 0 ? "h2" : "div",
          color: index === 0 ? "textPrimary" : "textSecondary",
        } as const;

        // If it’s the last crumb, just show the label without linking
        if (index === breadcrumbs.length - 1)
          return (
            <Typography {...crumbProps}>
              {getLabel(crumb) || crumb.replace(/([A-Z])/g, " $1")}
            </Typography>
          );

        // If odd: breadcrumb points to a document — don’t show a link
        // TODO: show a picker here to switch between sub tables
        if (index % 2 === 1)
          return (
            <Typography {...crumbProps}>
              {getLabel(
                parentLabel.split(",")[Math.ceil(index / 2) - 1] || crumb
              )}
            </Typography>
          );

        // Otherwise, even: breadcrumb points to a Firestore collection
        return (
          <Link
            key={crumbProps.key}
            component={RouterLink}
            to={`${routes.table}/${encodeURIComponent(
              breadcrumbs.slice(0, index + 1).join("/")
            )}`}
            variant={crumbProps.variant}
            color={crumbProps.color}
          >
            {getLabel(crumb) || crumb.replace(/([A-Z])/g, " $1")}
          </Link>
        );
      })}
    </MuiBreadcrumbs>
  );
}
