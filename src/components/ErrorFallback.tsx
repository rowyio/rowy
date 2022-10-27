import { useState, useEffect } from "react";
import { FallbackProps } from "react-error-boundary";
import { useLocation, Link } from "react-router-dom";
import useOffline from "@src/hooks/useOffline";

import { Typography, Button } from "@mui/material";
import ReloadIcon from "@mui/icons-material/Refresh";
import InlineOpenInNewIcon from "@src/components/InlineOpenInNewIcon";
import OfflineIcon from "@mui/icons-material/CloudOff";
import { Tables as TablesIcon } from "@src/assets/icons";

import EmptyState, { IEmptyStateProps } from "@src/components/EmptyState";
import AccessDenied from "@src/components/AccessDenied";

import { ROUTES } from "@src/constants/routes";
import { EXTERNAL_LINKS } from "@src/constants/externalLinks";

export const ERROR_TABLE_NOT_FOUND = "Table not found";

export interface IErrorFallbackProps extends FallbackProps, IEmptyStateProps {}

export function ErrorFallbackContents({
  error,
  resetErrorBoundary,
  ...props
}: IErrorFallbackProps) {
  const isOffline = useOffline();

  if ((error as any).code === "permission-denied")
    return (
      <AccessDenied error={error} resetErrorBoundary={resetErrorBoundary} />
    );

  let renderProps: Partial<IEmptyStateProps> = {
    message: "Something went wrong",
    description: (
      <>
        <Typography variant="inherit" style={{ whiteSpace: "pre-line" }}>
          {(error as any).code && <b>{(error as any).code}: </b>}
          {(error as any).status && <b>{(error as any).status}: </b>}
          {error.message}
        </Typography>
        <Button
          size={props.basic ? "small" : "medium"}
          href={
            EXTERNAL_LINKS.gitHub +
            "/discussions/new?" +
            new URLSearchParams({
              labels: "bug",
              category: "support-q-a",
              title: [
                "Error",
                (error as any).code,
                (error as any).status,
                error.message,
              ]
                .filter(Boolean)
                .join(": ")
                .replace(/\n/g, " "),
              body: "👉 **Please describe how to reproduce this bug here.**",
            }).toString()
          }
          target="_blank"
          rel="noopener noreferrer"
        >
          Report issue
          <InlineOpenInNewIcon />
        </Button>
      </>
    ),
  };

  if (error.message.startsWith(ERROR_TABLE_NOT_FOUND)) {
    if (isOffline) {
      renderProps = { Icon: OfflineIcon, message: "You’re offline" };
    } else {
      renderProps = {
        message: ERROR_TABLE_NOT_FOUND,
        description: (
          <>
            <Typography variant="inherit">
              Make sure you have the right ID
            </Typography>
            <code>
              {error.message.replace(ERROR_TABLE_NOT_FOUND + ": ", "")}
            </code>
            <Button
              size={props.basic ? "small" : "medium"}
              variant="outlined"
              color="secondary"
              component={Link}
              to={ROUTES.tables}
              startIcon={<TablesIcon />}
              onClick={() => resetErrorBoundary()}
            >
              All tables
            </Button>
          </>
        ),
      };
    }
  }

  if (error.message.startsWith("Loading chunk")) {
    if (isOffline) {
      renderProps = { Icon: OfflineIcon, message: "You’re offline" };
    } else {
      renderProps = {
        Icon: ReloadIcon,
        message: "Update available",
        description: (
          <Button
            size={props.basic ? "small" : "medium"}
            variant="outlined"
            color="secondary"
            startIcon={<ReloadIcon />}
            onClick={() => window.location.reload()}
            sx={{ mt: 1 }}
          >
            Reload
          </Button>
        ),
      };
    }
  }

  if (error.message.includes("Failed to fetch")) {
    renderProps = {
      Icon: OfflineIcon,
      message: "You’re offline",
      description: isOffline ? null : (
        <Button
          size={props.basic ? "small" : "medium"}
          variant="outlined"
          color="secondary"
          startIcon={<ReloadIcon />}
          onClick={() => window.location.reload()}
          sx={{ mt: 1 }}
        >
          Reload
        </Button>
      ),
    };
  }

  return <EmptyState role="alert" fullScreen {...renderProps} {...props} />;
}

export default function ErrorFallback(props: IErrorFallbackProps) {
  const { resetErrorBoundary } = props;

  // Reset error boundary when navigating away from the page
  const location = useLocation();
  const [errorPathname] = useState(location.pathname);
  useEffect(() => {
    if (errorPathname !== location.pathname) resetErrorBoundary();
  }, [errorPathname, location.pathname, resetErrorBoundary]);

  return <ErrorFallbackContents {...props} />;
}

export function InlineErrorFallback(props: IErrorFallbackProps) {
  return (
    <ErrorFallbackContents
      {...props}
      fullScreen={false}
      basic
      wrap="nowrap"
      sx={{ typography: "body2" }}
    />
  );
}

export function NonFullScreenErrorFallback(props: IErrorFallbackProps) {
  return <ErrorFallbackContents {...props} fullScreen={false} />;
}
