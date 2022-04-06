import { ReactNode, useState } from "react";

import {
  Dialog,
  DialogProps,
  Slide,
  IconButton,
  Container,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import ScrollableDialogContent, {
  IScrollableDialogContentProps,
} from "./ScrollableDialogContent";

export interface IFullScreenModalProps
  extends Partial<Omit<DialogProps, "title">> {
  onClose: (setOpen: React.Dispatch<React.SetStateAction<boolean>>) => void;
  disableBackdropClick?: boolean;
  disableEscapeKeyDown?: boolean;

  "aria-labelledby": DialogProps["aria-labelledby"];
  header?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;

  hideCloseButton?: boolean;
  ScrollableDialogContentProps?: Partial<IScrollableDialogContentProps>;
}

export default function FullScreenModal({
  onClose,
  disableBackdropClick,
  disableEscapeKeyDown,
  header,
  children,
  footer,
  hideCloseButton,
  ScrollableDialogContentProps,
  ...props
}: IFullScreenModalProps) {
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
      fullScreen
      open={open}
      onClose={handleClose}
      TransitionComponent={Slide}
      TransitionProps={{ direction: "up" } as any}
      {...props}
    >
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          pt: { xs: "var(--dialog-spacing)", xl: 6 },
        }}
      >
        {!hideCloseButton && (
          <IconButton
            onClick={handleClose as any}
            aria-label="Close"
            sx={{
              position: "absolute",
              top: (theme) => theme.spacing(1),
              right: (theme) => theme.spacing(1),

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

        {header}

        <ScrollableDialogContent
          style={{ padding: 0 }}
          {...ScrollableDialogContentProps}
        >
          {children}
        </ScrollableDialogContent>

        {footer}
      </Container>
    </Dialog>
  );
}
