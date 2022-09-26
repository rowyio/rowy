import { useAtom } from "jotai";
import { Link as RouterLink, useSearchParams } from "react-router-dom";
import { camelCase } from "lodash-es";

import { Stack, Breadcrumbs, Link, Typography, Tooltip } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ReadOnlyIcon from "@mui/icons-material/EditOffOutlined";

import { projectScope, userRolesAtom } from "@src/atoms/projectScope";
import { ROUTES } from "@src/constants/routes";
import { TableSettings } from "@src/types/table";

export interface IBreadcrumbsSubTableProps {
  rootTableSettings: TableSettings;
  subTableSettings: TableSettings;
  rootTableLink: string;
  parentLabel?: string;
}

export default function BreadcrumbsSubTable({
  rootTableSettings,
  subTableSettings,
  rootTableLink,
  parentLabel,
}: IBreadcrumbsSubTableProps) {
  const [userRoles] = useAtom(userRolesAtom, projectScope);
  const [searchParams] = useSearchParams();
  const splitSubTableId = subTableSettings.id.split("/");

  return (
    <Stack direction="row" alignItems="center" spacing={1.5}>
      <Breadcrumbs
        sx={{
          typography: "button",
          fontSize: (theme) => theme.typography.h6.fontSize,
          color: "text.disabled",

          "& .MuiBreadcrumbs-ol": {
            userSelect: "none",
            flexWrap: "nowrap",
            whiteSpace: "nowrap",
          },
          "& .MuiBreadcrumbs-li": { display: "flex" },
          "& .MuiTypography-inherit": { typography: "h6" },
        }}
      >
        <Link
          component={RouterLink}
          to={`${ROUTES.home}#${camelCase(rootTableSettings.section)}`}
          color="text.secondary"
          underline="hover"
        >
          {rootTableSettings.section}
        </Link>

        <Link
          component={RouterLink}
          to={rootTableLink}
          color="text.secondary"
          underline="hover"
        >
          {rootTableSettings.name}
        </Link>

        {splitSubTableId.length > 3 && (
          <MoreHorizIcon style={{ position: "relative", top: 1 }} />
        )}

        <Typography variant="inherit" color="text.secondary">
          {searchParams.get("parentLabel") ||
            splitSubTableId[splitSubTableId.length - 2]}
        </Typography>

        <Typography variant="inherit" color="text.primary">
          {subTableSettings.name}
        </Typography>
      </Breadcrumbs>

      {rootTableSettings.readOnly && (
        <Tooltip
          title={
            userRoles.includes("ADMIN")
              ? "Table is read-only for non-ADMIN users"
              : "Table is read-only"
          }
        >
          <ReadOnlyIcon fontSize="small" sx={{ ml: 0.5 }} color="action" />
        </Tooltip>
      )}
    </Stack>
  );
}
