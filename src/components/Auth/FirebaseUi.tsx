import { useState, useEffect } from "react";
import clsx from "clsx";

import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { Props as FirebaseUiProps } from "react-firebaseui";

import { makeStyles, createStyles } from "@mui/styles";
import { Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import Skeleton from "@mui/material/Skeleton";

import { auth, db } from "@src/firebase";
import { defaultUiConfig, getSignInOptions } from "@src/firebase/firebaseui";
import { PUBLIC_SETTINGS } from "@src/config/dbPaths";

const useStyles = makeStyles((theme) =>
  createStyles({
    "@global": {
      ".rowy-firebaseui": {
        width: "100%",
        minHeight: 32,

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
        "& .firebaseui-idp-list>.firebaseui-list-item, & .firebaseui-tenant-list>.firebaseui-list-item":
          {
            margin: 0,
          },
        "& .firebaseui-list-item + .firebaseui-list-item": {
          paddingTop: theme.spacing(1),
        },

        "& .mdl-button": {
          borderRadius: theme.shape.borderRadius,
          ...theme.typography.button,
        },
        "& .mdl-button--raised": {
          boxShadow: `0 -1px 0 0 rgba(0, 0, 0, 0.12) inset, ${theme.shadows[2]}`,
          "&:hover": {
            boxShadow: `0 -1px 0 0 rgba(0, 0, 0, 0.12) inset, ${theme.shadows[4]}`,
          },
          "&:active, &:focus": {
            boxShadow: `0 -1px 0 0 rgba(0, 0, 0, 0.12) inset, ${theme.shadows[8]}`,
          },
        },
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

        "& .firebaseui-idp-button.mdl-button--raised, & .firebaseui-tenant-button.mdl-button--raised":
          {
            maxWidth: "none",
            minHeight: 32,
            padding: theme.spacing(0.5, 1),

            backgroundColor: theme.palette.action.input + " !important",
            "&:hover": {
              backgroundColor: theme.palette.action.hover + " !important",
            },
            "&:active, &:focus": {
              backgroundColor:
                theme.palette.action.disabledBackground + " !important",
            },

            "&, &:hover, &.Mui-disabled": { border: "none" },
            "&, &:hover, &:active, &:focus": {
              boxShadow: `0 0 0 1px ${theme.palette.action.inputOutline} inset,
               0 ${theme.palette.mode === "dark" ? "" : "-"}1px 0 0 ${
                theme.palette.action.inputOutline
              } inset`,
            },
          },
        "& .firebaseui-idp-icon": {
          display: "block",
          width: 20,
          height: 20,
        },
        "& .firebaseui-idp-text": {
          ...theme.typography.button,
          color: theme.palette.text.primary,

          paddingLeft: theme.spacing(2),
          paddingRight: Number(theme.spacing(2).replace("px", "")) + 18,
          marginLeft: -18,
          width: "100%",
          textAlign: "center",

          "&.firebaseui-idp-text-long": { display: "none" },
          "&.firebaseui-idp-text-short": { display: "table-cell" },
        },

        "& .firebaseui-idp-google > .firebaseui-idp-text": {
          color: theme.palette.text.primary,
        },
        "& .firebaseui-idp-github .firebaseui-idp-icon, & [data-provider-id='apple.com'] .firebaseui-idp-icon":
          {
            filter: theme.palette.mode === "dark" ? "invert(1)" : "",
          },
        "& [data-provider-id='microsoft.com'] .firebaseui-idp-icon": {
          width: 21,
          height: 21,
          position: "relative",
          left: -1,
          top: -1,
        },
        "& [data-provider-id='yahoo.com'] > .firebaseui-idp-icon-wrapper > .firebaseui-idp-icon":
          {
            width: 18,
            height: 18,
            filter:
              theme.palette.mode === "dark"
                ? "invert(1) saturate(0) brightness(1.5)"
                : "",
          },
        "& .firebaseui-idp-password .firebaseui-idp-icon, & .firebaseui-idp-phone .firebaseui-idp-icon, & .firebaseui-idp-anonymous .firebaseui-idp-icon":
          {
            width: 24,
            height: 24,
            position: "relative",
            left: -2,
            filter: theme.palette.mode === "light" ? "invert(1)" : "",
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
        "& .mdl-textfield--floating-label.is-dirty .mdl-textfield__label, .mdl-textfield--floating-label.is-focused .mdl-textfield__label":
          {
            color: theme.palette.text.primary,
          },
        "& .firebaseui-textfield.mdl-textfield .firebaseui-label:after": {
          backgroundColor: theme.palette.primary.main,
        },
        "& .mdl-textfield.is-invalid .mdl-textfield__label:after": {
          backgroundColor: theme.palette.error.main,
        },

        "& .mdl-progress>.bufferbar": {
          background: alpha(theme.palette.primary.main, 0.33),
        },
        "& .mdl-progress>.progressbar": {
          backgroundColor: theme.palette.primary.main + " !important",
        },
      },
    },

    signInText: {
      display: "block",
      textAlign: "center",
      color: theme.palette.text.secondary,
      margin: theme.spacing(-1, 0, -3),
    },

    skeleton: {
      width: "100%",
      marginBottom: "calc(var(--spacing-contents) * -1)",

      "& > *": {
        width: "100%",
        height: 32,
        borderRadius: theme.shape.borderRadius,
      },

      "& > * + *": {
        marginTop: theme.spacing(1),
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
    db.doc(PUBLIC_SETTINGS)
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
      <>
        <Typography variant="button" className={classes.signInText}>
          Continue with
        </Typography>

        <div id="rowy-firebaseui-skeleton" className={classes.skeleton}>
          <Skeleton variant="rectangular" />
        </div>
      </>
    );

  const uiConfig: firebaseui.auth.Config = {
    ...defaultUiConfig,
    ...props.uiConfig,
    callbacks: {
      uiShown: () => {
        const node = document.getElementById("rowy-firebaseui-skeleton");
        if (node) node.style.display = "none";
      },
      ...props.uiConfig?.callbacks,
    },
    signInOptions: getSignInOptions(signInOptions),
  };

  return (
    <>
      <Typography variant="button" className={classes.signInText}>
        Continue with
      </Typography>

      <StyledFirebaseAuth
        {...props}
        firebaseAuth={auth}
        uiConfig={uiConfig}
        className={clsx("rowy-firebaseui", props.className)}
      />
    </>
  );
}
