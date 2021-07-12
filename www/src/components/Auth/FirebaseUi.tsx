import { useState, useEffect } from "react";
import clsx from "clsx";

import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { Props as FirebaseUiProps } from "react-firebaseui";

import { makeStyles, createStyles, Typography } from "@material-ui/core";
import { fade } from "@material-ui/core/styles";
import Skeleton from "@material-ui/lab/Skeleton";

import { auth, db } from "../../firebase";
import { defaultUiConfig, getSignInOptions } from "../../firebase/firebaseui";

const useStyles = makeStyles((theme) =>
  createStyles({
    "@global": {
      ".firetable-firebaseui": {
        "& .firebaseui-container": {
          backgroundColor: "transparent",
          color: theme.palette.text.primary,
          fontFamily: theme.typography.fontFamily,
        },
        "& .firebaseui-text": {
          color: theme.palette.text.secondary,
          fontFamily: theme.typography.fontFamily,
        },
        "& .firebaseui-tos": {
          ...theme.typography.caption,
          color: theme.palette.text.disabled,
        },
        "& .firebaseui-country-selector": {
          color: theme.palette.text.primary,
        },
        "& .firebaseui-title": {
          ...theme.typography.h5,
          color: theme.palette.text.primary,
        },
        "& .firebaseui-subtitle": {
          ...theme.typography.h6,
          color: theme.palette.text.secondary,
        },
        "& .firebaseui-error": {
          ...theme.typography.caption,
          color: theme.palette.error.main,
        },

        "& .firebaseui-card-content, & .firebaseui-card-footer": { padding: 0 },
        "& .firebaseui-idp-list, & .firebaseui-tenant-list": { margin: 0 },
        "& .firebaseui-idp-list>.firebaseui-list-item, & .firebaseui-tenant-list>.firebaseui-list-item": {
          margin: 0,
        },
        "& .firebaseui-list-item + .firebaseui-list-item": {
          paddingTop: theme.spacing(2),
        },

        "& .mdl-button": {
          borderRadius: 24,
          ...theme.typography.button,
        },
        "& .mdl-button--raised": { boxShadow: "none" },
        "& .mdl-card": {
          boxShadow: "none",
          minHeight: 0,
        },
        "& .mdl-button--primary.mdl-button--primary": {
          color: theme.palette.primary.main,
        },
        "& .mdl-button--raised.mdl-button--colored": {
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,

          "&:active, &:focus:not(:active), &:hover": {
            backgroundColor: theme.palette.primary.main,
          },
        },

        "& .firebaseui-idp-button, & .firebaseui-tenant-button": {
          maxWidth: "none",
          minHeight: 48,
        },
        "& .firebaseui-idp-text": {
          ...theme.typography.button,

          paddingLeft: theme.spacing(2),
          paddingRight: theme.spacing(2) + 18,
          marginLeft: -18,
          width: "100%",
          textAlign: "center",

          [theme.breakpoints.down("xs")]: {
            "&.firebaseui-idp-text-long": { display: "none" },
            "&.firebaseui-idp-text-short": { display: "table-cell" },
          },
        },

        "& .firebaseui-idp-google": {
          "& .firebaseui-idp-icon-wrapper::before": {
            content: "''",
            display: "block",
            position: "absolute",
            top: 2,
            left: 2,
            width: 48 - 4,
            height: 48 - 4,
            zIndex: 0,

            backgroundColor: "#fff",
            borderRadius: "50%",
          },
          "& .firebaseui-idp-icon-wrapper img": {
            position: "relative",
            left: -1,
          },

          "&>.firebaseui-idp-text": {
            color: "#fff",
          },
        },

        "& .firebaseui-card-header": { padding: 0 },
        "& .firebaseui-card-actions": { padding: 0 },

        "& .firebaseui-input, & .firebaseui-input-invalid": {
          ...theme.typography.body1,
          color: theme.palette.text.primary,
        },
        "& .firebaseui-textfield.mdl-textfield .firebaseui-input": {
          borderColor: theme.palette.divider,
        },
        "& .mdl-textfield.is-invalid .mdl-textfield__input": {
          borderColor: theme.palette.error.main,
        },
        "& .firebaseui-label": {
          ...theme.typography.subtitle2,
          color: theme.palette.text.secondary,
        },
        "& .mdl-textfield--floating-label.is-dirty .mdl-textfield__label, .mdl-textfield--floating-label.is-focused .mdl-textfield__label": {
          color: theme.palette.text.primary,
        },
        "& .firebaseui-textfield.mdl-textfield .firebaseui-label:after": {
          backgroundColor: theme.palette.primary.main,
        },
        "& .mdl-textfield.is-invalid .mdl-textfield__label:after": {
          backgroundColor: theme.palette.error.main,
        },

        "& .mdl-progress>.bufferbar": {
          background: fade(theme.palette.primary.main, 0.33),
        },
        "& .mdl-progress>.progressbar": {
          backgroundColor: theme.palette.primary.main + " !important",
        },
      },
    },

    signInText: {
      display: "none",
      [theme.breakpoints.down("xs")]: { display: "block" },

      textAlign: "center",
      color: theme.palette.text.disabled,
      marginBottom: theme.spacing(-1),
    },

    skeleton: {
      marginBottom: "calc(var(--spacing-contents) * -1)",

      "& > *": {
        width: "100%",
        height: 48,
        borderRadius: 24,
      },

      "& > * + *": {
        marginTop: theme.spacing(2),
      },
    },
  })
);

export default function FirebaseUi(props: Partial<FirebaseUiProps>) {
  const classes = useStyles();

  const [signInOptions, setSignInOptions] = useState<
    Parameters<typeof getSignInOptions>[0] | undefined
  >();
  useEffect(() => {
    db.doc("/_FIRETABLE_/publicSettings")
      .get()
      .then((doc) => {
        const options = doc?.get("signInOptions");
        if (!options) {
          setSignInOptions(["google"]);
        } else {
          setSignInOptions(options);
        }
      })
      .catch(() => setSignInOptions(["google"]));
  }, []);

  if (!signInOptions)
    return (
      <div
        id="firetable-firebaseui-skeleton"
        className={classes.skeleton}
        style={{ marginBottom: 0 }}
      >
        <Skeleton variant="rect" />
      </div>
    );

  const uiConfig: firebaseui.auth.Config = {
    ...defaultUiConfig,
    ...props.uiConfig,
    callbacks: {
      uiShown: () => {
        const node = document.getElementById("firetable-firebaseui-skeleton");
        if (node) node.style.display = "none";
      },
      ...props.uiConfig?.callbacks,
    },
    signInOptions: getSignInOptions(signInOptions),
  };

  return (
    <>
      <Typography variant="button" className={classes.signInText}>
        Sign in with
      </Typography>

      <div id="firetable-firebaseui-skeleton" className={classes.skeleton}>
        {Object.keys(signInOptions).map((_, i) => (
          <Skeleton key={i} variant="rect" />
        ))}
      </div>

      <StyledFirebaseAuth
        {...props}
        firebaseAuth={auth}
        uiConfig={uiConfig}
        className={clsx("firetable-firebaseui", props.className)}
      />
    </>
  );
}
