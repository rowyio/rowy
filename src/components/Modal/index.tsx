import { ReactNode, useState } from "react";

import {
  useTheme,
  useMediaQuery,
  Dialog,
  DialogProps,
  Stack,
  DialogTitle,
  IconButton,
  DialogContent,
  DialogActions,
  Button,
  ButtonProps,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

import { SlideTransitionMui } from "./SlideTransition";

export interface IModalProps extends Partial<Omit<DialogProps, "title">> {
  onClose: () => void;
  disableBackdropClick?: boolean;

  title: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;

  children?: ReactNode;
  body?: ReactNode;

  actions?: {
    primary?: Partial<ButtonProps>;
    secondary?: Partial<ButtonProps>;
  };

  hideCloseButton?: boolean;
  fullHeight?: boolean;
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
      TransitionComponent={SlideTransitionMui}
      onClose={handleClose}
      fullWidth
      fullScreen={isMobile}
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
            color="secondary"
            sx={{
              mt: { xs: 0.5, sm: 1.5 },
              mb: { xs: 0.5, sm: 1.5 },
              ml: "var(--dialog-spacing)",
              mr: -1.5,
            }}
          >
            <CloseIcon />
          </IconButton>
        )}
      </Stack>

      {header}

      <DialogContent>{children || body}</DialogContent>

      {footer}

      {actions && (
        <DialogActions>
          {actions.secondary && <Button {...actions.secondary} />}

          {actions.primary && (
            <Button variant="contained" color="primary" {...actions.primary} />
          )}
        </DialogActions>
      )}
    </Dialog>
  );
}
