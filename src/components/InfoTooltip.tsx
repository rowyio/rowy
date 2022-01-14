import { useState } from "react";
import _merge from "lodash/merge";

import { Tooltip, IconButton } from "@mui/material";
import { alpha } from "@mui/material/styles";
import InfoIcon from "@mui/icons-material/InfoOutlined";
import CloseIcon from "@mui/icons-material/Close";

export interface IInfoTooltipProps {
  description: React.ReactNode;
  buttonLabel?: string;
  defaultOpen?: boolean;

  buttonProps?: Partial<React.ComponentProps<typeof IconButton>>;
  tooltipProps?: Partial<React.ComponentProps<typeof Tooltip>>;
  iconProps?: Partial<React.ComponentProps<typeof InfoIcon>>;
}

export default function InfoTooltip({
  description,
  buttonLabel = "Info",
  defaultOpen,

  buttonProps,
  tooltipProps,
  iconProps,
}: IInfoTooltipProps) {
  const [open, setOpen] = useState(defaultOpen || false);

  return (
    <Tooltip
      title={
        <>
          {description}
          <IconButton
            aria-label={`Close ${buttonLabel}`}
            size="small"
            onClick={() => setOpen(false)}
            sx={{
              m: -0.5,
              opacity: 0.8,
              "&:hover": {
                backgroundColor: (theme) =>
                  alpha("#fff", theme.palette.action.hoverOpacity),
              },
            }}
            color="inherit"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </>
      }
      disableFocusListener
      disableHoverListener
      disableTouchListener
      arrow
      placement="right-start"
      describeChild
      {...tooltipProps}
      open={open}
      componentsProps={_merge(
        {
          tooltip: {
            style: {
              marginLeft: "8px",
              transformOrigin: "-8px 14px",
            },
            sx: {
              typography: "body2",

              display: "flex",
              gap: 1.5,
              alignItems: "flex-start",
              pr: 0.5,
            },
          },
        },
        tooltipProps?.componentsProps
      )}
    >
      <IconButton
        aria-label={buttonLabel}
        size="small"
        {...buttonProps}
        onClick={() => setOpen((x) => !x)}
      >
        {buttonProps?.children || <InfoIcon fontSize="small" {...iconProps} />}
      </IconButton>
    </Tooltip>
  );
}
