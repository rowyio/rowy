import { ReactNode, useState } from "react";

import {
  useTheme,
  useMediaQuery,
  Dialog,
  DialogProps,
  Stack,
  DialogTitle,
  IconButton,
  DialogActions,
  Button,
  ButtonProps,
  Slide,
} from "@mui/material";
import LoadingButton, { LoadingButtonProps } from "@mui/lab/LoadingButton";
import CloseIcon from "@mui/icons-material/Close";

import { SlideTransitionMui } from "./SlideTransition";
import ScrollableDialogContent, {
  IScrollableDialogContentProps,
} from "./ScrollableDialogContent";

export interface IModalProps extends Partial<Omit<DialogProps, "title">> {
  onClose: () => void;
  disableBackdropClick?: boolean;

  title: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;

  children?: ReactNode;
  body?: ReactNode;

  actions?: {
    primary?: Partial<LoadingButtonProps>;
    secondary?: Partial<ButtonProps>;
  };

  hideCloseButton?: boolean;
  fullHeight?: boolean;
  ScrollableDialogContentProps?: Partial<IScrollableDialogContentProps>;
}

export default function Modal({
  onClose,
  disableBackdropClick,
  title,
  header,
  footer,
  children,
  body,
  actions,
  hideCloseButton,
  fullHeight,
  ScrollableDialogContentProps,
  ...props
}: IModalProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [open, setOpen] = useState(true);
  const handleClose = (_, reason?: string) => {
    if (disableBackdropClick && reason === "backdropClick") return;

    setOpen(false);
    setTimeout(() => onClose(), 300);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      fullScreen={isMobile}
      TransitionComponent={isMobile ? Slide : SlideTransitionMui}
      TransitionProps={isMobile ? ({ direction: "up" } as any) : undefined}
      aria-labelledby="modal-title"
      {...props}
      sx={
        fullHeight
          ? {
              ...props.sx,
              "& .MuiDialog-paper": {
                height: "100%",
                ...props.sx?.["& .MuiDialog-paper"],
              },
            }
          : props.sx
      }
    >
      <Stack direction="row" alignItems="flex-start">
        <DialogTitle
          id="modal-title"
          style={{ flexGrow: 1, userSelect: "none" }}
        >
          {title}
        </DialogTitle>

        {!hideCloseButton && (
          <IconButton
            onClick={handleClose}
            aria-label="Close"
            sx={{
              m: { xs: 1, sm: 1.5 },
              ml: { xs: -1, sm: -1 },
            }}
            className="dialog-close"
          >
            <CloseIcon />
          </IconButton>
        )}
      </Stack>

      {header}

      <ScrollableDialogContent {...ScrollableDialogContentProps}>
        {children || body}
      </ScrollableDialogContent>

      {footer}

      {actions && (
        <DialogActions>
          {actions.secondary && <Button {...actions.secondary} />}

          {actions.primary && (
            <LoadingButton
              variant="contained"
              color="primary"
              {...actions.primary}
            />
          )}
        </DialogActions>
      )}
    </Dialog>
  );
}
