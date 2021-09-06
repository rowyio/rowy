import Div100vh from "react-div-100vh";

import {
  Grid,
  GridProps,
  Stack,
  Typography,
  SvgIconTypeMap,
} from "@material-ui/core";
import { OverridableComponent } from "@material-ui/core/OverridableComponent";
import ErrorIcon from "@material-ui/icons/ErrorOutline";

export interface IEmptyStateProps extends Partial<GridProps> {
  /** Primary message displayed under the icon */
  message?: React.ReactNode;
  /** Description text displayed under primary message */
  description?: React.ReactNode;
  /** Override icon component */
  Icon?: OverridableComponent<SvgIconTypeMap>;
  /** Set height to `100vh`. Default: `false` */
  fullScreen?: boolean;
  /** Basic inline presentation without padding. Default: `false` */
  basic?: boolean;
}

/**
 * Display an empty state message with sensible defaults.
 * By default, height is `100%`.
 * Override with props that are passed to the root MUI `Grid` component.
 */
export default function EmptyState({
  message = "Nothing Here",
  description,
  Icon = ErrorIcon,
  fullScreen = false,
  basic = false,
  ...props
}: IEmptyStateProps) {
  if (basic)
    return (
      <Grid container alignItems="center" spacing={1} {...props}>
        <Grid item>
          <Icon style={{ display: "block" }} />
        </Grid>

        <Grid item>
          {message}
          {description && ": "}
          {description}
        </Grid>
      </Grid>
    );

  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
      component={fullScreen ? Div100vh : "div"}
      {...props}
      style={{
        width: "100%",
        height: fullScreen ? "100rvh" : "100%",
        textAlign: "center",
        ...props.style,
      }}
    >
      <Grid
        item
        sx={{
          maxWidth: "25em",
          px: 2,
          typography: "body2",

          "& .icon": {
            color: "action.active",
            fontSize: "3rem",
            mx: "auto",
            display: "block",
            mb: 1,
          },
        }}
      >
        <Icon className="icon" />

        <Typography
          component="h1"
          variant="h6"
          gutterBottom
          style={{ cursor: "default" }}
        >
          {message}
        </Typography>

        {description && (
          <Stack spacing={2} alignItems="center">
            {description}
          </Stack>
        )}
      </Grid>
    </Grid>
  );
}
