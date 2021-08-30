import React, { useState } from "react";
import clsx from "clsx";

import { makeStyles, createStyles } from "@material-ui/styles";
import {
  useTheme,
  useMediaQuery,
  Dialog,
  DialogProps,
  DialogTitle,
  Typography,
  IconButton,
  DialogContent,
  Grid,
  Button,
  ButtonProps,
} from "@material-ui/core";

import CloseIcon from "@material-ui/icons/Close";

import { SlideTransitionMui } from "./SlideTransition";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      "--spacing-modal": theme.spacing(3),
      "--spacing-modal-contents": theme.spacing(3),
      "--spacing-card": "var(--spacing-modal-contents)",

      [theme.breakpoints.down("md")]: {
        "--spacing-modal": theme.spacing(2),
      },
    },

    paper: {
      userSelect: "none",
      overflowX: "hidden",

      padding: "var(--spacing-modal)",
      paddingBottom: "var(--spacing-modal-contents)",
    },
    fullHeight: { height: "100%" },

    titleRow: {
      minHeight: 16,
      padding: 0,
      paddingBottom: "var(--spacing-modal)",

      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
    },
    title: {
      margin: `-${(28 - 16) / 2}px 0`,
    },
    closeButton: {
      margin: theme.spacing(-1.5),
      marginLeft: "var(--spacing-modal)",
    },

    content: {
      padding: "0 var(--spacing-modal)",
      margin: "0 calc(var(--spacing-modal) * -1)",

      ...theme.typography.body1,

      backgroundRepeat: "no-repeat",
      backgroundColor: "var(--bg-paper)",
      backgroundSize: "100% 2px, 100% 3px, 100% 1px, 100% 1px",
      backgroundAttachment: "local, local, scroll, scroll",

      "&:last-child": {
        marginBottom: "calc(var(--spacing-modal-contents) * -1)",
        paddingBottom: "var(--spacing-modal-contents)",
      },

      "& > * + *": { marginTop: "var(--spacing-modal-contents)" },
    },

    actions: {
      paddingTop: "var(--spacing-modal-contents)",
      "& button": { minWidth: 100 },
    },
  })
);

export interface IModalProps extends Partial<Omit<DialogProps, "title">> {
  onClose: () => void;
  disableBackdropClick?: boolean;

  title: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;

  children?: React.ReactNode;
  body?: React.ReactNode;

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
  const classes = useStyles();
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
      classes={{
        ...props.classes,
        root: clsx(classes.root, props.classes?.root),
        paper: clsx(
          classes.paper,
          fullHeight && classes.fullHeight,
          props.classes?.paper
        ),
      }}
    >
      <DialogTitle id="modal-title" className={classes.titleRow}>
        <Typography variant="h6" component="span" className={classes.title}>
          {title}
        </Typography>

        {!hideCloseButton && (
          <IconButton
            onClick={handleClose}
            className={classes.closeButton}
            aria-label="Close"
            color="secondary"
          >
            <CloseIcon />
          </IconButton>
        )}
      </DialogTitle>

      {header}

      <DialogContent className={classes.content}>
        {children || body}
      </DialogContent>

      {footer}

      {actions && (
        <Grid
          container
          spacing={2}
          justifyContent="center"
          alignItems="center"
          className={classes.actions}
        >
          {actions.secondary && (
            <Grid item>
              <Button {...actions.secondary} />
            </Grid>
          )}

          {actions.primary && (
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                {...actions.primary}
              />
            </Grid>
          )}
        </Grid>
      )}
    </Dialog>
  );
}
