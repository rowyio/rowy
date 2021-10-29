import _find from "lodash/find";
import queryString from "query-string";
import { Link as RouterLink } from "react-router-dom";
import _camelCase from "lodash/camelCase";

import {
  Breadcrumbs as MuiBreadcrumbs,
  BreadcrumbsProps,
  Link,
  Typography,
} from "@mui/material";
import ArrowRightIcon from "@mui/icons-material/ChevronRight";

import { useProjectContext } from "@src/contexts/ProjectContext";
import useRouter from "@src/hooks/useRouter";
import routes from "@src/constants/routes";

export default function Breadcrumbs(props: BreadcrumbsProps) {
  const { tables, tableState } = useProjectContext();
  const id = tableState?.config.id || "";
  const collection = id || tableState?.tablePath || "";

  const router = useRouter();
  let parentLabel = decodeURIComponent(
    queryString.parse(router.location.search).parentLabel as string
  );
  if (parentLabel === "undefined") parentLabel = "";

  const breadcrumbs = collection.split("/");

  const section = _find(tables, ["id", breadcrumbs[0]])?.section || "";
  const getLabel = (id: string) => _find(tables, ["id", id])?.name || id;

  return (
    <MuiBreadcrumbs
      separator={<ArrowRightIcon />}
      aria-label="Sub-table breadcrumbs"
      sx={{
        "& ol": {
          pl: 2,
          userSelect: "none",
          flexWrap: "nowrap",
          whiteSpace: "nowrap",
        },
      }}
      {...(props as any)}
    >
      {/* Section name */}
      {section && (
        <Link
          component={RouterLink}
          to={`${routes.home}#${_camelCase(section)}`}
          variant="h6"
          color="textSecondary"
          underline="hover"
        >
          {section}
        </Link>
      )}

      {breadcrumbs.map((crumb: string, index) => {
        // If it’s the first breadcrumb, show with specific style
        const crumbProps = {
          key: index,
          variant: "h6",
          component: index === 0 ? "h2" : "div",
          color:
            index === breadcrumbs.length - 1 ? "textPrimary" : "textSecondary",
        } as const;

        // If it’s the last crumb, just show the label without linking
        if (index === breadcrumbs.length - 1)
          return (
            <Typography {...crumbProps}>
              {getLabel(crumb) || crumb.replace(/([A-Z])/g, " $1")}
            </Typography>
          );

        // If odd: breadcrumb points to a document — link to rowRef
        // TODO: show a picker here to switch between sub tables
        if (index % 2 === 1)
          return (
            <Link
              {...crumbProps}
              component={RouterLink}
              to={`${routes.table}/${encodeURIComponent(
                breadcrumbs.slice(0, index).join("/")
              )}?rowRef=${breadcrumbs.slice(0, index + 1).join("%2F")}`}
              underline="hover"
            >
              {getLabel(
                parentLabel.split(",")[Math.ceil(index / 2) - 1] || crumb
              )}
            </Link>
          );

        // Otherwise, even: breadcrumb points to a Firestore collection
        return (
          <Link
            {...crumbProps}
            component={RouterLink}
            to={`${routes.table}/${encodeURIComponent(
              breadcrumbs.slice(0, index + 1).join("/")
            )}`}
            underline="hover"
          >
            {getLabel(crumb) || crumb.replace(/([A-Z])/g, " $1")}
          </Link>
        );
      })}
    </MuiBreadcrumbs>
  );
}
