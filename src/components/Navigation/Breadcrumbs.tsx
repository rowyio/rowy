import { useState } from "react";
import _find from "lodash/find";
import queryString from "query-string";
import { Link as RouterLink } from "react-router-dom";
import _camelCase from "lodash/camelCase";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

import {
  Breadcrumbs as MuiBreadcrumbs,
  BreadcrumbsProps,
  Link,
  Typography,
  Tooltip,
} from "@mui/material";
import ArrowRightIcon from "@mui/icons-material/ChevronRight";
import ReadOnlyIcon from "@mui/icons-material/EditOffOutlined";

import InfoTooltip from "@src/components/InfoTooltip";
import RenderedMarkdown from "@src/components/RenderedMarkdown";
import { useAppContext } from "@src/contexts/AppContext";
import { useProjectContext } from "@src/contexts/ProjectContext";
import useRouter from "@src/hooks/useRouter";
import routes from "@src/constants/routes";

const tableDescriptionDismissedAtom = atomWithStorage<string[]>(
  "tableDescriptionDismissed",
  []
);

export default function Breadcrumbs({ sx = [], ...props }: BreadcrumbsProps) {
  const { userClaims } = useAppContext();
  const { tables, table, tableState } = useProjectContext();
  const id = tableState?.config.id || "";
  const collection = id || tableState?.tablePath || "";

  const router = useRouter();
  let parentLabel = decodeURIComponent(
    queryString.parse(router.location.search).parentLabel as string
  );
  if (parentLabel === "undefined") parentLabel = "";

  const breadcrumbs = collection.split("/");

  const section = table?.section || "";
  const getLabel = (id: string) => _find(tables, ["id", id])?.name || id;

  const [dismissed, setDismissed] = useAtom(tableDescriptionDismissedAtom);

  return (
    <MuiBreadcrumbs
      separator={<ArrowRightIcon />}
      aria-label="Sub-table breadcrumbs"
      {...props}
      sx={[
        {
          "& .MuiBreadcrumbs-ol": {
            userSelect: "none",
            flexWrap: "nowrap",
            whiteSpace: "nowrap",
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
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
          component: index === 0 ? "h1" : "div",
          color:
            index === breadcrumbs.length - 1 ? "textPrimary" : "textSecondary",
        } as const;

        // If it’s the last crumb, just show the label without linking
        if (index === breadcrumbs.length - 1)
          return (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Typography {...crumbProps}>
                {getLabel(crumb) || crumb.replace(/([A-Z])/g, " $1")}
              </Typography>
              {crumb === table?.id && table?.readOnly && (
                <Tooltip
                  title={
                    userClaims?.roles.includes("ADMIN")
                      ? "Table is read-only for non-ADMIN users"
                      : "Table is read-only"
                  }
                >
                  <ReadOnlyIcon fontSize="small" sx={{ ml: 0.5 }} />
                </Tooltip>
              )}

              {crumb === table?.id && table?.description && (
                <InfoTooltip
                  description={
                    <div>
                      <RenderedMarkdown
                        children={table?.description}
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
                  defaultOpen={!dismissed.includes(table?.id)}
                  onClose={() => setDismissed((d) => [...d, table?.id])}
                />
              )}
            </div>
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
