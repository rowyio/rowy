import clsx from "clsx";
import { Link, LinkProps } from "react-router-dom";

import {
  makeStyles,
  createStyles,
  Card,
  Grid,
  Typography,
  Button,
  CardActions,
  CardContent,
  CardMedia,
  Divider,
} from "@material-ui/core";
import { ButtonProps } from "@material-ui/core/Button";

import GoIcon from "assets/icons/Go";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: { width: "100%" },
    container: { height: "100%" },
    cardContent: { "&:last-child": { paddingBottom: 0 } },

    headerSection: { marginBottom: theme.spacing(1) },
    overline: {
      marginBottom: theme.spacing(2),
      color: theme.palette.text.disabled,
    },
    title: { whiteSpace: "pre-line" },
    image: {
      width: 80,
      height: 80,
      borderRadius: theme.shape.borderRadius,
    },

    cardActions: {
      padding: theme.spacing(1),

      display: "flex",
      justifyContent: "space-between",
    },

    divider: {
      margin: theme.spacing(2),
      marginBottom: 0,
    },
  })
);

interface StyledCardProps {
  className?: string;

  overline?: React.ReactNode;
  title?: string;
  imageSource?: string;

  bodyContent?: React.ReactNode;

  primaryButton?: Partial<ButtonProps>;
  primaryLink?: {
    to: LinkProps["to"];
    children?: React.ReactNode;
    label?: string;
  };
  secondaryAction?: React.ReactNode;
  headerAction?: React.ReactNode;
}

export default function StyledCard({
  className,
  overline,
  title,
  imageSource,
  bodyContent,
  primaryButton,
  primaryLink,
  secondaryAction,
  headerAction,
}: StyledCardProps) {
  const classes = useStyles();

  return (
    <Card className={clsx(className, classes.root)}>
      <Grid
        container
        direction="column"
        wrap="nowrap"
        className={classes.container}
      >
        <Grid item xs>
          <CardContent className={clsx(classes.container, classes.cardContent)}>
            <Grid
              container
              direction="column"
              wrap="nowrap"
              className={classes.container}
            >
              <Grid item>
                <Grid container className={classes.headerSection} spacing={3}>
                  <Grid item xs>
                    {overline && (
                      <Typography
                        variant="overline"
                        className={classes.overline}
                      >
                        {overline}
                      </Typography>
                    )}
                    <Grid container direction="row" justify="space-between">
                      {title && (
                        <Typography variant="h5" className={classes.title}>
                          {title}
                        </Typography>
                      )}
                      {headerAction && headerAction}
                    </Grid>
                  </Grid>

                  {imageSource && (
                    <Grid item>
                      <CardMedia
                        className={classes.image}
                        image={imageSource}
                        title={title}
                      />
                    </Grid>
                  )}
                </Grid>
              </Grid>

              <Grid item xs>
                {bodyContent && Array.isArray(bodyContent) ? (
                  <Grid
                    container
                    direction="column"
                    wrap="nowrap"
                    justify="space-between"
                  >
                    {bodyContent.map((element) => (
                      <Grid item>{element}</Grid>
                    ))}
                  </Grid>
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    {bodyContent}
                  </Typography>
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Grid>

        <Grid item>
          <Divider className={classes.divider} />
          <CardActions className={classes.cardActions}>
            {primaryButton && <Button color="primary" {...primaryButton} />}
            {primaryLink && (
              <Button
                color="primary"
                component={Link as any}
                to={primaryLink.to}
                children={primaryLink.children || primaryLink.label}
                endIcon={<GoIcon />}
              />
            )}

            {secondaryAction}
          </CardActions>
        </Grid>
      </Grid>
    </Card>
  );
}
