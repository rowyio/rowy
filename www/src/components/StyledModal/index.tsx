import React, { useState, useRef } from "react";

import {
  makeStyles,
  createStyles,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogProps,
  IconButton,
  DialogTitle,
  DialogContent,
  // Tabs,
  // Tab,
  Divider,
  Grid,
  Button,
  ButtonProps,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

import { TransitionGrow, TransitionSlide } from "./Transition";

const useStyles = makeStyles((theme) =>
  createStyles({
    paper: {
      userSelect: "none",
      overflowX: "hidden",
    },

    paperFullScreen: {
      marginTop: theme.spacing(2),
      height: `calc(100% - ${theme.spacing(2)}px)`,
      borderTopLeftRadius: theme.shape.borderRadius * 2,
      borderTopRightRadius: theme.shape.borderRadius * 2,
    },

    closeButton: {
      margin: theme.spacing(0.5),
      marginLeft: "auto",
      marginBottom: 0,
      display: "flex",
    },

    title: {
      paddingTop: theme.spacing(8),
      paddingLeft: theme.spacing(8),
      color: theme.palette.text.secondary,

      [theme.breakpoints.down("xs")]: {
        paddingTop: theme.spacing(2),
        paddingLeft: theme.spacing(2),
      },
    },
    divider: {
      margin: theme.spacing(0, 8),
      [theme.breakpoints.down("xs")]: { margin: theme.spacing(0, 2) },
    },

    content: {
      padding: theme.spacing(3, 8, 6),
      [theme.breakpoints.down("xs")]: { padding: theme.spacing(1, 2, 2) },

      "& > section + section": { marginTop: theme.spacing(4) },
    },

    actions: {
      margin: theme.spacing(0, -2),
      padding: theme.spacing(0, 8, 2),

      [theme.breakpoints.down("xs")]: {
        margin: theme.spacing(0, -0.5),
        padding: theme.spacing(1, 0),
        marginTop: "auto",
      },

      "& button": { minWidth: 142 },
    },
  })
);

export interface IStyledModalProps extends Partial<Omit<DialogProps, "title">> {
  onClose: () => void;
  initialTab?: number;

  title: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;

  tabs?: {
    label: string;
    content: React.ReactNode | React.ReactNodeArray;
    disabled?: boolean;
  }[];
  children?: React.ReactNode;
  bodyContent?: React.ReactNode;

  actions?: {
    primary?: Partial<ButtonProps>;
    secondary?: Partial<ButtonProps>;
  };
}

export default function StyledModal({
  onClose,
  initialTab = 0,
  title,
  header,
  footer,
  tabs,
  children,
  bodyContent,
  actions,
  ...props
}: IStyledModalProps) {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // const [tab, setTab] = useState(initialTab)
  // const handleChangeTab = (_, newValue: number) => {
  //   setTab(newValue)
  //   if (scrollContainerRef?.current)
  //     scrollContainerRef.current.scrollTo({ top: 0, left: 0 })
  // }

  const [open, setOpen] = useState(true);
  const handleClose = () => {
    setOpen(false);
    setTimeout(onClose, 300);
  };

  return (
    <Dialog
      open={open}
      TransitionComponent={isMobile ? TransitionSlide : TransitionGrow}
      onClose={handleClose}
      fullWidth
      fullScreen={isMobile}
      aria-labelledby="sub-modal-title"
      classes={{
        paper: classes.paper,
        paperFullScreen: classes.paperFullScreen,
      }}
      {...props}
    >
      <Grid container>
        <Grid item xs>
          <DialogTitle id="sub-modal-title" className={classes.title}>
            {title}
          </DialogTitle>
        </Grid>
        <Grid item>
          <IconButton
            onClick={handleClose}
            className={classes.closeButton}
            aria-label="Close"
          >
            <CloseIcon />
          </IconButton>
        </Grid>
      </Grid>

      <Divider className={classes.divider} />

      {header}

      {/* {tabs && (
          <div className={classes.tabsContainer}>
            <Tabs
              className={classes.tabs}
              value={tab}
              onChange={handleChangeTab}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
              aria-label="full width tabs"
              action={actions =>
                setTimeout(() => actions?.updateIndicator(), 200)
              }
            >
              {tabs?.map((tab, index) => (
                <Tab
                  key={`card-tab-${index}`}
                  className={classes.tab}
                  label={tab.label}
                  disabled={tab.disabled}
                  {...a11yProps(index)}
                />
              ))}
            </Tabs>
            <Divider className={clsx(classes.tabs, classes.tabDivider)} />
          </div>
        )} */}

      <DialogContent className={classes.content} ref={scrollContainerRef}>
        {/* {tabs && (
          <div className={classes.tabSection}>
            {tabs[tab].content && Array.isArray(tabs[tab].content) ? (
              <Grid
                container
                direction="column"
                wrap="nowrap"
                spacing={3}
                className={classes.tabContentGrid}
              >
                {(tabs?.[tab]?.content as string[])?.map((element, index) => (
                  <Grid item key={`tab-content-${index}`}>
                    {element}
                  </Grid>
                ))}
              </Grid>
            ) : (
              tabs[tab].content
            )}
          </div>
        )} */}

        {children || bodyContent}
      </DialogContent>

      {footer}

      {actions && (
        <Grid
          container
          spacing={isMobile ? 1 : 4}
          justify="center"
          alignItems="center"
          className={classes.actions}
        >
          {actions.secondary && (
            <Grid item>
              <Button size="large" variant="outlined" {...actions.secondary} />
            </Grid>
          )}

          {actions.primary && (
            <Grid item>
              <Button size="large" variant="contained" {...actions.primary} />
            </Grid>
          )}
        </Grid>
      )}
    </Dialog>
  );
}
