import React, { useState } from "react";
import clsx from "clsx";

import {
  Card,
  Grid,
  Typography,
  Button,
  CardActions,
  CardContent,
  CardMedia,
  Divider,
  Tabs,
  Tab,
} from "@material-ui/core";
import { ButtonProps } from "@material-ui/core/Button";
import GoIcon from "assets/icons/Go";

import useStyles from "./styles";
export interface ICardProps {
  className?: string;
  style?: React.CSSProperties;

  overline?: React.ReactNode;
  title?: React.ReactNode;
  imageSource?: string;
  imageShape?: "square" | "circle";
  imageClassName?: string;

  tabs?: {
    label: string;
    content: React.ReactNode;
    disabled?: boolean;
  }[];
  bodyContent?: React.ReactNode;

  primaryButton?: { label: string } & Partial<ButtonProps>;
  primaryLink?: {
    href?: string;
    target?: string;
    rel?: string;
    label: string;
  } & Partial<ButtonProps>;
  secondaryAction?: React.ReactNode;
}

const a11yProps = (index: number) => ({
  id: `full-width-tab-${index}`,
  "aria-controls": `full-width-tabpanel-${index}`,
});

export default function BasicCard({
  className,
  style,

  overline,
  title,
  imageSource,
  imageShape = "square",
  imageClassName,

  tabs,
  bodyContent,

  primaryButton,
  primaryLink,
  secondaryAction,
}: ICardProps) {
  const classes = useStyles();

  const [tab, setTab] = useState(0);

  const handleChangeTab = (event: React.ChangeEvent<{}>, newValue: number) =>
    setTab(newValue);

  return (
    <Card className={clsx(classes.root, className)} style={style}>
      <Grid
        container
        direction="column"
        wrap="nowrap"
        className={classes.container}
      >
        <Grid item xs className={classes.cardContentContainer}>
          <CardContent className={clsx(classes.container, classes.cardContent)}>
            <Grid
              container
              direction="column"
              wrap="nowrap"
              className={classes.container}
            >
              {(overline || title || imageSource) && (
                <Grid item className={classes.headerContainer}>
                  <Grid container spacing={3}>
                    <Grid item xs>
                      {overline && (
                        <Typography
                          variant="overline"
                          className={classes.overline}
                        >
                          {overline}
                        </Typography>
                      )}
                      {title && (
                        <Typography variant="h5" className={classes.title}>
                          {title}
                        </Typography>
                      )}
                    </Grid>

                    {imageSource && (
                      <Grid item>
                        <CardMedia
                          className={clsx(
                            classes.image,
                            imageShape === "circle" && classes.imageCircle,
                            imageClassName
                          )}
                          image={imageSource}
                          title={typeof title === "string" ? title : ""}
                        />
                      </Grid>
                    )}
                  </Grid>
                </Grid>
              )}

              {tabs && (
                <Grid item className={classes.tabsContainer}>
                  <Tabs
                    className={classes.tabs}
                    value={tab}
                    onChange={handleChangeTab}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                    aria-label="full width tabs"
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
                </Grid>
              )}

              {(tabs || bodyContent) && (
                <Grid item xs className={classes.contentContainer}>
                  {tabs && (
                    <div className={classes.tabSection}>
                      {tabs[tab].content && Array.isArray(tabs[tab].content) ? (
                        <Grid
                          container
                          direction="column"
                          wrap="nowrap"
                          justify="space-between"
                          spacing={3}
                          className={classes.tabContentGrid}
                        >
                          {(tabs[tab].content as React.ReactNode[]).map(
                            (element, index) => (
                              <Grid item key={`tab-content-${index}`}>
                                {element}
                              </Grid>
                            )
                          )}
                        </Grid>
                      ) : (
                        tabs[tab].content
                      )}
                    </div>
                  )}

                  {bodyContent && Array.isArray(bodyContent) ? (
                    <Grid
                      container
                      direction="column"
                      wrap="nowrap"
                      justify="space-between"
                      className={classes.container}
                    >
                      {bodyContent.map((element, i) => (
                        <Grid item key={i}>
                          {element}
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    bodyContent
                  )}
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Grid>

        {(primaryButton || primaryLink || secondaryAction) && (
          <Grid item>
            <Divider className={classes.divider} />
            <CardActions className={classes.cardActions}>
              <Grid item>
                {primaryButton && (
                  <Button
                    {...primaryButton}
                    color={primaryButton.color || "primary"}
                    disabled={!!primaryButton.disabled}
                    endIcon={
                      primaryButton.endIcon === undefined ? (
                        <GoIcon />
                      ) : (
                        primaryButton.endIcon
                      )
                    }
                  >
                    {primaryButton.label}
                  </Button>
                )}
                {primaryLink && (
                  <Button
                    classes={{ label: classes.primaryLinkLabel }}
                    {...(primaryLink as any)}
                    color={primaryLink.color || "primary"}
                    component="a"
                    endIcon={
                      primaryLink.endIcon === undefined ? (
                        <GoIcon />
                      ) : (
                        primaryLink.endIcon
                      )
                    }
                  >
                    {primaryLink.label}
                  </Button>
                )}
              </Grid>
              {secondaryAction && <Grid item>{secondaryAction}</Grid>}
            </CardActions>
          </Grid>
        )}
      </Grid>
    </Card>
  );
}
