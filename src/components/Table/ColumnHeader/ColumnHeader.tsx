import { useRef } from "react";
import { useAtom, useSetAtom } from "jotai";
import { useDrag, useDrop } from "react-dnd";

import {
  styled,
  alpha,
  Tooltip,
  TooltipProps,
  tooltipClasses,
  Fade,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import DropdownIcon from "@mui/icons-material/MoreHoriz";
import LockIcon from "@mui/icons-material/LockOutlined";

import ColumnHeaderSort from "./ColumnHeaderSort";

import {
  globalScope,
  userRolesAtom,
  altPressAtom,
} from "@src/atoms/globalScope";
import {
  tableScope,
  updateColumnAtom,
  columnMenuAtom,
} from "@src/atoms/tableScope";
import { getFieldProp } from "@src/components/fields";
import { COLUMN_HEADER_HEIGHT } from "@src/components/Table/Column";
import { ColumnConfig } from "@src/types/table";

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

export interface IDraggableHeaderRendererProps {
  column: ColumnConfig;
}

export default function DraggableHeaderRenderer({
  column,
}: IDraggableHeaderRendererProps) {
  const [userRoles] = useAtom(userRolesAtom, globalScope);
  const updateColumn = useSetAtom(updateColumnAtom, tableScope);
  const openColumnMenu = useSetAtom(columnMenuAtom, tableScope);
  const [altPress] = useAtom(altPressAtom, globalScope);

  const [{ isDragging }, dragRef] = useDrag({
    type: "COLUMN_DRAG",
    item: { key: column.key },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, dropRef] = useDrop({
    accept: "COLUMN_DRAG",
    drop: ({ key }: { key: string }) => {
      updateColumn({ key, config: {}, index: column.index });
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleOpenMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    openColumnMenu({ column, anchorEl: buttonRef.current });
  };

  return (
    <Grid
      key={column.key}
      id={`column-header-${column.key}`}
      ref={(ref) => {
        dragRef(ref);
        dropRef(ref);
      }}
      container
      alignItems="center"
      wrap="nowrap"
      onContextMenu={handleOpenMenu}
      sx={[
        {
          height: "100%",
          "& svg, & button": { display: "block" },

          color: "text.secondary",
          transition: (theme) =>
            theme.transitions.create("color", {
              duration: theme.transitions.duration.short,
            }),
          "&:hover": { color: "text.primary" },

          cursor: "move",

          py: 0,
          pr: 0.5,
          pl: 1,
          width: "100%",
        },
        isDragging
          ? { opacity: 0.5 }
          : isOver
          ? {
              backgroundColor: (theme) =>
                alpha(
                  theme.palette.primary.main,
                  theme.palette.action.focusOpacity
                ),
              color: "primary.main",
            }
          : {},
      ]}
      className="column-header"
    >
      {(column.width as number) > 140 && (
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
        >
          <Typography
            noWrap
            sx={{
              typography: "caption",
              fontWeight: "fontWeightMedium",
              lineHeight: `${COLUMN_HEADER_HEIGHT}px`,
              textOverflow: "clip",
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

      <Grid item>
        <ColumnHeaderSort column={column as any} />
      </Grid>

      <Grid item>
        <Tooltip title="Column settings">
          <IconButton
            size="small"
            aria-label={`Column settings for ${column.name as string}`}
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
              ".column-header:hover &": { color: "text.primary" },
            }}
          >
            <DropdownIcon />
          </IconButton>
        </Tooltip>
      </Grid>
    </Grid>
  );
}
