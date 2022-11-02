import { useMemo, useEffect } from "react";
import { useAtom } from "jotai";

import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";
import { onAuthStateChanged } from "firebase/auth";

import { makeStyles } from "tss-react/mui";
import { Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";

import { projectScope, publicSettingsAtom } from "@src/atoms/projectScope";
import { firebaseAuthAtom } from "@src/sources/ProjectSourceFirebase";
import { defaultUiConfig, getSignInOptions } from "@src/config/firebaseui";

const ELEMENT_ID = "firebaseui_container";

const useStyles = makeStyles()((theme) => ({
  root: {
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
    "& .firebaseui-provider-sign-in-footer > .firebaseui-tos": {
      ...(theme.typography.caption as any),
      color: theme.palette.text.disabled,
      textAlign: "left",
      marginTop: theme.spacing(1),
      marginBottom: 0,
      "& .firebaseui-link": {
        textDecorationColor: theme.palette.divider,
        "&:hover": { textDecorationColor: "currentcolor" },
      },
    },
    "& .firebaseui-link": {
      color: "inherit",
      textDecoration: "underline",
    },
    "& .firebaseui-country-selector": {
      color: theme.palette.text.primary,
    },
    "& .firebaseui-title": {
      ...(theme.typography.h5 as any),
      color: theme.palette.text.primary,
    },
    "& .firebaseui-subtitle": {
      ...(theme.typography.h6 as any),
      color: theme.palette.text.secondary,
    },
    "& .firebaseui-error": {
      ...(theme.typography.caption as any),
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
      ...(theme.typography.button as any),
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
      ...(theme.typography.button as any),
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
      ...(theme.typography.body1 as any),
      color: theme.palette.text.primary,
    },
    "& .firebaseui-textfield.mdl-textfield .firebaseui-input": {
      borderColor: theme.palette.divider,
    },
    "& .mdl-textfield.is-invalid .mdl-textfield__input": {
      borderColor: theme.palette.error.main,
    },
    "& .firebaseui-label": {
      ...(theme.typography.subtitle2 as any),
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
}));

export interface IFirebaseUiProps {
  className?: string;
  uiConfig?: firebaseui.auth.Config;
}

export default function FirebaseUi(props: IFirebaseUiProps) {
  const { classes, cx } = useStyles();
  const [firebaseAuth] = useAtom(firebaseAuthAtom, projectScope);
  const [publicSettings] = useAtom(publicSettingsAtom, projectScope);

  const signInOptions: typeof publicSettings.signInOptions = useMemo(
    () =>
      Array.isArray(publicSettings.signInOptions) &&
      publicSettings.signInOptions.length > 0
        ? publicSettings.signInOptions
        : ["google"],
    [publicSettings.signInOptions]
  );

  const uiConfig: firebaseui.auth.Config = useMemo(
    () => ({
      ...defaultUiConfig,
      ...props.uiConfig,
      signInOptions: getSignInOptions(signInOptions),
    }),
    [props.uiConfig, signInOptions]
  );

  useEffect(() => {
    let firebaseUiWidget: firebaseui.auth.AuthUI;
    let userSignedIn = false;
    let unregisterAuthObserver: ReturnType<typeof onAuthStateChanged>;

    // Get or Create a firebaseUI instance.
    firebaseUiWidget =
      firebaseui.auth.AuthUI.getInstance() ||
      new firebaseui.auth.AuthUI(firebaseAuth);

    if (uiConfig.signInFlow === "popup") firebaseUiWidget.reset();

    // We track the auth state to reset firebaseUi if the user signs out.
    unregisterAuthObserver = onAuthStateChanged(firebaseAuth, (user) => {
      if (!user && userSignedIn) firebaseUiWidget.reset();
      userSignedIn = !!user;
    });

    // Render the firebaseUi Widget.
    firebaseUiWidget.start("#" + ELEMENT_ID, uiConfig);

    return () => {
      unregisterAuthObserver();
      firebaseUiWidget.reset();
    };
  }, [firebaseAuth, uiConfig]);

  return (
    <>
      <Typography
        variant="button"
        display="block"
        color="textSecondary"
        sx={{
          "&&": { mt: -1, mb: -3, textAlign: "center", alignSelf: "center" },
        }}
      >
        Continue with
      </Typography>

      <div className={cx(classes.root, props.className)} id={ELEMENT_ID} />
    </>
  );
}
