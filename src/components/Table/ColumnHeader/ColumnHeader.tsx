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
  columnMenuAtom,
} from "@src/atoms/globalScope";
import { tableScope, updateColumnAtom } from "@src/atoms/tableScope";
import { FieldType } from "@src/constants/fields";
import { getFieldProp } from "@src/components/fields";
import { DEFAULT_ROW_HEIGHT } from "@src/components/Table";
import { ColumnConfig } from "@src/types/table";
import useKeyPress from "@src/hooks/useKeyPress";

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,

    margin: `-${DEFAULT_ROW_HEIGHT - 2}px 0 0 !important`,
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
  const openColumnMenu = useSetAtom(columnMenuAtom, globalScope);
  const altPress = useKeyPress("Alt");

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
                lineHeight: `${DEFAULT_ROW_HEIGHT - 1 - 4}px`,
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
              lineHeight: `${DEFAULT_ROW_HEIGHT + 1}px`,
              textOverflow: "clip",
            }}
            component="div"
            color="inherit"
          >
            {altPress ? `${column.index}: ${column.fieldName}` : column.name}
          </Typography>
        </LightTooltip>
      </Grid>

      <Grid item>
        <ColumnHeaderSort column={column as any} />
      </Grid>

      {(userRoles.includes("ADMIN") ||
        (userRoles.includes("OPS") &&
          [FieldType.multiSelect, FieldType.singleSelect].includes(
            (column as any).type
          ))) && (
        <Grid item>
          <Tooltip title="Column settings">
            <IconButton
              size="small"
              aria-label={`Column settings for ${column.name as string}`}
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
      )}
    </Grid>
  );
}
