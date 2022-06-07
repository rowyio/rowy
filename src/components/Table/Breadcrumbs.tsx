import { useAtom } from "jotai";
import {
  useLocation,
  useSearchParams,
  Link as RouterLink,
} from "react-router-dom";
import { find, camelCase, uniq } from "lodash-es";

import {
  Breadcrumbs as MuiBreadcrumbs,
  BreadcrumbsProps,
  Link,
  Typography,
  Tooltip,
} from "@mui/material";
import ReadOnlyIcon from "@mui/icons-material/EditOffOutlined";

import InfoTooltip from "@src/components/InfoTooltip";
import RenderedMarkdown from "@src/components/RenderedMarkdown";

import {
  globalScope,
  userRolesAtom,
  tableDescriptionDismissedAtom,
  tablesAtom,
} from "@src/atoms/globalScope";
import { ROUTES } from "@src/constants/routes";
import { spreadSx } from "@src/utils/ui";

export default function Breadcrumbs({ sx = [], ...props }: BreadcrumbsProps) {
  const [userRoles] = useAtom(userRolesAtom, globalScope);
  const [dismissed, setDismissed] = useAtom(
    tableDescriptionDismissedAtom,
    globalScope
  );
  const [tables] = useAtom(tablesAtom, globalScope);

  const { pathname } = useLocation();
  const id = pathname.replace(ROUTES.table + "/", "");
  const [searchParams] = useSearchParams();

  const tableSettings = find(tables, ["id", id]);
  if (!tableSettings) return null;

  const collection = id || tableSettings.collection;
  const parentLabel = decodeURIComponent(searchParams.get("parentLabel") || "");
  const breadcrumbs = collection.split("/");
  const section = tableSettings.section;
  const getLabel = (id: string) => find(tables, ["id", id])?.name || id;

  return (
    <MuiBreadcrumbs
      aria-label="Table breadcrumbs"
      {...props}
      sx={[
        {
          fontSize: (theme) => theme.typography.h6.fontSize,
          fontWeight: "medium",
          color: "text.disabled",

          "& .MuiBreadcrumbs-ol": {
            userSelect: "none",
            flexWrap: "nowrap",
            whiteSpace: "nowrap",
          },
          "& .MuiBreadcrumbs-li": { display: "flex" },
        },
        ...spreadSx(sx),
      ]}
    >
      {/* Section name */}
      {section && (
        <Link
          component={RouterLink}
          to={`${ROUTES.home}#${camelCase(section)}`}
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
          component: index === 0 ? "h1" : "div",
          color:
            index === breadcrumbs.length - 1 ? "textPrimary" : "textSecondary",
        } as const;

        // If it’s the last crumb, just show the label without linking
        if (index === breadcrumbs.length - 1)
          return (
            <div
              key={crumb || index}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Typography {...crumbProps}>
                {getLabel(crumb) || crumb.replace(/([A-Z])/g, " $1")}
              </Typography>
              {crumb === tableSettings.id && tableSettings.readOnly && (
                <Tooltip
                  title={
                    userRoles.includes("ADMIN")
                      ? "Table is read-only for non-ADMIN users"
                      : "Table is read-only"
                  }
                >
                  <ReadOnlyIcon fontSize="small" sx={{ ml: 0.5 }} />
                </Tooltip>
              )}

              {crumb === tableSettings.id && tableSettings.description && (
                <InfoTooltip
                  description={
                    <div>
                      <RenderedMarkdown
                        children={tableSettings.description}
                        restrictionPreset="singleLine"
                      />
                    </div>
                  }
                  buttonLabel="Table info"
                  tooltipProps={{
                    componentsProps: {
                      popper: { sx: { zIndex: "appBar" } },
                      tooltip: { sx: { maxWidth: "75vw" } },
                    } as any,
                  }}
                  defaultOpen={!dismissed.includes(tableSettings.id)}
                  onClose={() =>
                    setDismissed((d) => uniq([...d, tableSettings.id]))
                  }
                />
              )}
            </div>
          );

        // If odd: breadcrumb points to a document — link to rowRef
        // FUTURE: show a picker here to switch between sub tables
        if (index % 2 === 1)
          return (
            <Link
              {...crumbProps}
              component={RouterLink}
              to={`${ROUTES.table}/${encodeURIComponent(
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
            to={`${ROUTES.table}/${encodeURIComponent(
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
