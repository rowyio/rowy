import React from "react";
import { auth } from "../../firebase";
import { uiConfig } from "constants/firebaseui";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";

import { makeStyles, createStyles, Typography } from "@material-ui/core";

import AuthLayout from "components/Auth/AuthLayout";

const useStyles = makeStyles((theme) =>
  createStyles({
    "@global": {
      ".firetable-firebaseui": {
        "& .firebaseui-container": { fontFamily: theme.typography.fontFamily },

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
          backgroundColor: "#4285F4 !important",

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
        '& .firebaseui-idp-github, & [data-provider-id="microsoft.com"]': {
          backgroundColor: "#000 !important",
        },

        "& .firebaseui-card-header": { padding: 0 },
        "& .firebaseui-subtitle, .firebaseui-title": theme.typography.h5,
        "& .firebaseui-card-actions": { padding: 0 },

        "& .firebaseui-textfield.mdl-textfield .firebaseui-label:after": {
          backgroundColor: theme.palette.primary.main,
        },
      },
    },

    signInText: {
      display: "none",
      [theme.breakpoints.down("xs")]: { display: "block" },

      textAlign: "center",
      color: theme.palette.text.disabled,
      marginBottom: theme.spacing(-2),
    },
  })
);

export default function AuthPage() {
  const classes = useStyles();

  return (
    <AuthLayout>
      <Typography variant="button" className={classes.signInText}>
        Sign in with
      </Typography>
      <StyledFirebaseAuth
        firebaseAuth={auth}
        uiConfig={uiConfig}
        className="firetable-firebaseui"
      />
    </AuthLayout>
  );
}
