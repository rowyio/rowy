import { forwardRef, useRef } from "react";
import { useAtom, useSetAtom } from "jotai";

import {
  styled,
  Tooltip,
  TooltipProps,
  tooltipClasses,
  Fade,
  Grid,
  GridProps,
  IconButton,
  Typography,
} from "@mui/material";
import DropdownIcon from "@mui/icons-material/MoreHoriz";
import LockIcon from "@mui/icons-material/LockOutlined";

import ColumnHeaderSort, { SORT_STATES } from "./ColumnHeaderSort";

import { projectScope, altPressAtom } from "@src/atoms/projectScope";
import {
  tableScope,
  columnMenuAtom,
  tableSortsAtom,
} from "@src/atoms/tableScope";
import { getFieldProp } from "@src/components/fields";
import { COLUMN_HEADER_HEIGHT } from "@src/components/Table/Column";
import { ColumnConfig } from "@src/types/table";
import { FieldType } from "@src/constants/fields";
import { spreadSx } from "@src/utils/ui";

export { COLUMN_HEADER_HEIGHT };

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,

    margin: `-${COLUMN_HEADER_HEIGHT - 1 - 2}px 0 0 !important`,
    padding: 0,
    paddingRight: theme.spacing(1.5),
  },
}));

export interface IColumnHeaderProps extends Partial<GridProps> {
  column: ColumnConfig;
  width: number;
  focusInsideCell: boolean;
  children: React.ReactNode;
}

export const ColumnHeader = forwardRef(function ColumnHeader(
  { column, width, focusInsideCell, children, ...props }: IColumnHeaderProps,
  ref: React.Ref<HTMLDivElement>
) {
  const openColumnMenu = useSetAtom(columnMenuAtom, tableScope);
  const [altPress] = useAtom(altPressAtom, projectScope);
  const [tableSorts] = useAtom(tableSortsAtom, tableScope);

  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleOpenMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    openColumnMenu({ column, anchorEl: buttonRef.current });
  };

  const _sortKey = getFieldProp("sortKey", (column as any).type);
  const sortKey = _sortKey ? `${column.key}.${_sortKey}` : column.key;
  const currentSort: typeof SORT_STATES[number] =
    tableSorts[0]?.key !== sortKey
      ? "none"
      : tableSorts[0]?.direction || "none";

  return (
    <Grid
      role="columnheader"
      id={`column-header-${column.key}`}
      ref={ref}
      {...props}
      aria-sort={
        currentSort === "none"
          ? "none"
          : currentSort === "asc"
          ? "ascending"
          : "descending"
      }
      container
      alignItems="center"
      wrap="nowrap"
      onContextMenu={handleOpenMenu}
      sx={[
        {
          height: "100%",
          "& svg, & button": { display: "block", zIndex: 1 },
          border: (theme) => `1px solid ${theme.palette.divider}`,

          backgroundColor: "background.default",
          color: "text.secondary",
          transition: (theme) =>
            theme.transitions.create("color", {
              duration: theme.transitions.duration.short,
            }),
          "&:hover": { color: "text.primary" },

          position: "relative",

          py: 0,
          pr: 0.5,
          pl: 1,
          width: "100%",
        },
        ...spreadSx(props.sx),
      ]}
    >
      {width > 140 && (
        <Tooltip
          title={
            <>
              Click to copy field key:
              <br />
              <code style={{ padding: 0 }}>{column.key}</code>
            </>
          }
          enterDelay={1000}
          placement="bottom-start"
          arrow
        >
          <Grid
            item
            onClick={() => {
              navigator.clipboard.writeText(column.key);
            }}
            style={{ position: "relative", zIndex: 2 }}
          >
            {column.editable === false ? (
              <LockIcon />
            ) : (
              getFieldProp("icon", (column as any).type)
            )}
          </Grid>
        </Tooltip>
      )}

      <Grid
        item
        xs
        sx={{ flexShrink: 1, overflow: "hidden", my: 0, ml: 0.5, mr: -30 / 8 }}
      >
        <LightTooltip
          title={
            <Typography
              sx={{
                typography: "caption",
                fontWeight: "fontWeightMedium",
                lineHeight: `${COLUMN_HEADER_HEIGHT - 2 - 4}px`,
                textOverflow: "clip",
              }}
              color="inherit"
            >
              {column.name as string}
            </Typography>
          }
          enterDelay={1000}
          placement="bottom-start"
          disableInteractive
          TransitionComponent={Fade}
          sx={{ "& .MuiTooltip-tooltip": { marginTop: "-28px !important" } }}
        >
          <Typography
            noWrap
            sx={{
              typography: "caption",
              fontWeight: "fontWeightMedium",
              textOverflow: "clip",
              position: "relative",
              zIndex: 1,
            }}
            component="div"
            color="inherit"
          >
            {altPress ? (
              <>
                {column.index} <code>{column.fieldName}</code>
              </>
            ) : (
              column.name
            )}
          </Typography>
        </LightTooltip>
      </Grid>

      {column.type !== FieldType.id && (
        <Grid item>
          <ColumnHeaderSort
            sortKey={sortKey}
            currentSort={currentSort}
            tabIndex={focusInsideCell ? 0 : -1}
          />
        </Grid>
      )}

      <Grid item>
        <Tooltip title="Column settings">
          <IconButton
            size="small"
            aria-label={`Column settings for ${column.name as string}`}
            tabIndex={focusInsideCell ? 0 : -1}
            id={`column-settings-${column.key}`}
            color="inherit"
            onClick={handleOpenMenu}
            ref={buttonRef}
            sx={{
              transition: (theme) =>
                theme.transitions.create("color", {
                  duration: theme.transitions.duration.short,
                }),

              color: "text.disabled",
              "[role='columnheader']:hover &, [role='columnheader']:focus &, [role='columnheader']:focus-within &, &:focus":
                { color: "text.primary" },
            }}
          >
            <DropdownIcon />
          </IconButton>
        </Tooltip>
      </Grid>

      {children}
    </Grid>
  );
});

export default ColumnHeader;
