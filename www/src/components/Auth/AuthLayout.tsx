import Div100vh from "react-div-100vh";

import {
  makeStyles,
  createStyles,
  Paper,
  Typography,
  LinearProgress,
} from "@material-ui/core";
import { fade } from "@material-ui/core/styles";

import bgPattern from "assets/bg-pattern.svg";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      backgroundBlendMode: "normal, overlay, normal, normal",
      // backgroundImage: `
      //   linear-gradient(to bottom, rgba(255,255,255,0), #fff),
      //   linear-gradient(155deg, #303030 -4%, ${theme.palette.primary.main} 92%),
      //   url('${bgPattern}'),
      //   linear-gradient(161deg, #ecf4ff -31%, #fff4f4 160%)
      // `,
      backgroundImage: `
        linear-gradient(to bottom, ${fade(
          theme.palette.background.default,
          0
        )}, ${theme.palette.background.default} 75%),
        linear-gradient(155deg, ${theme.palette.primary.main} 10%, ${
        theme.palette.secondary.main
      } 90%),
        url('${bgPattern}'),
        linear-gradient(161deg, ${fade(
          theme.palette.background.default,
          0.95
        )} -31%, ${fade(theme.palette.background.default, 0.98)} 160%)
      `,

      display: "grid",
      placeItems: "center",
      padding: theme.spacing(1),

      cursor: "default",
    },

    paper: {
      position: "relative",
      overflow: "hidden",

      maxWidth: 400,
      width: "100%",
      padding: theme.spacing(4),
      backgroundColor:
        theme.palette.background.elevation?.[8] ||
        theme.palette.background.paper,

      "--spacing-contents": theme.spacing(4) + "px",
      "& > * + *": { marginTop: "var(--spacing-contents)" },

      textAlign: "center",
    },

    wordmark: {
      display: "block",

      color: theme.palette.primary.main,
      letterSpacing: 0,
      fontVariantLigatures: "common-ligatures",
    },

    projectName: {
      display: "block",
      marginTop: theme.spacing(1),

      color: theme.palette.text.disabled,
    },

    progress: {
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      marginTop: 0,
    },
  })
);

export interface IAuthLayoutProps {
  children: React.ReactNode;
  loading?: boolean;
}

export default function AuthLayout({ children, loading }: IAuthLayoutProps) {
  const classes = useStyles();

  return (
    <Div100vh className={classes.root} style={{ minHeight: "100rvh" }}>
      <Paper className={classes.paper}>
        <Typography variant="h4" component="h1" className={classes.wordmark}>
          firetable
        </Typography>
        <Typography variant="overline" className={classes.projectName}>
          {process.env.REACT_APP_FIREBASE_PROJECT_ID}
        </Typography>
        {children}

        {loading && <LinearProgress className={classes.progress} />}
      </Paper>
    </Div100vh>
  );
}
