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
  onClose: (setOpen: React.Dispatch<React.SetStateAction<boolean>>) => void;
  disableBackdropClick?: boolean;
  disableEscapeKeyDown?: boolean;

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
  disableEscapeKeyDown,
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
  const handleClose: NonNullable<DialogProps["onClose"]> = (_, reason) => {
    if (
      (disableBackdropClick && reason === "backdropClick") ||
      (disableEscapeKeyDown && reason === "escapeKeyDown")
    ) {
      setEmphasizeCloseButton(true);
      return;
    }

    setOpen(false);
    setEmphasizeCloseButton(false);
    setTimeout(() => onClose(setOpen), 300);
  };

  const [emphasizeCloseButton, setEmphasizeCloseButton] = useState(false);

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
            onClick={handleClose as any}
            aria-label="Close"
            sx={{
              m: { xs: 1, sm: 1.5 },
              ml: { xs: -1, sm: -1 },

              bgcolor: emphasizeCloseButton ? "error.main" : undefined,
              color: emphasizeCloseButton ? "error.contrastText" : undefined,
              "&:hover": emphasizeCloseButton
                ? { bgcolor: "error.dark" }
                : undefined,
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
