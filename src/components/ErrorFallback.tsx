import { useState, useEffect } from "react";
import { FallbackProps } from "react-error-boundary";
import { useLocation } from "react-router-dom";
import useOffline from "@src/hooks/useOffline";

import { Typography, Button } from "@mui/material";
import ReloadIcon from "@mui/icons-material/Refresh";
import InlineOpenInNewIcon from "@src/components/InlineOpenInNewIcon";
import OfflineIcon from "@mui/icons-material/CloudOff";

import EmptyState, { IEmptyStateProps } from "@src/components/EmptyState";
import AccessDenied from "@src/components/AccessDenied";

import { EXTERNAL_LINKS } from "@src/constants/externalLinks";

export interface IErrorFallbackProps extends FallbackProps, IEmptyStateProps {}

export function ErrorFallbackContents({
  error,
  resetErrorBoundary,
  ...props
}: IErrorFallbackProps) {
  // Detect if the user is offline
  const isOffline = useOffline();

  // Handle permission-denied error
  if ((error as any).code === "permission-denied") {
    return (
      <AccessDenied error={error} resetErrorBoundary={resetErrorBoundary} />
    );
  }

  // Default renderProps for generic errors
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
            // Construct the GitHub issue URL
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
              body: "👉 **Please describe the steps that you took that led to this bug.**",
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

  // Handle "Loading chunk" error
  if (error.message.startsWith("Loading chunk")) {
    if (isOffline) {
      // Display offline message and provide a reload option
      renderProps = {
        Icon: OfflineIcon,
        message: "You’re offline",
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
    } else {
      // Display update available message with reload option
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

  // Handle "Failed to fetch" error
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

  // Display the empty state component with the appropriate renderProps
  return <EmptyState role="alert" fullScreen {...renderProps} {...props} />;
}

export default function ErrorFallback(props: IErrorFallbackProps) {
  const { resetErrorBoundary } = props;

  // Reset error boundary when navigating away from the page
  const location = useLocation();
  const [errorPathname, setErrorPathname] = useState(location.pathname);
  useEffect(() => {
    if (errorPathname !== location.pathname) {
      resetErrorBoundary();
      setErrorPathname(location.pathname);
    }
  }, [errorPathname, location.pathname, resetErrorBoundary]);

  // Render the ErrorFallbackContents component with props
  return <ErrorFallbackContents {...props} />;
}

export function InlineErrorFallback(props: IErrorFallbackProps) {
  return (
    // Render the ErrorFallbackContents component with specific props
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
  return (
    // Render the ErrorFallbackContents component with specific props
    <ErrorFallbackContents {...props} fullScreen={false} />
  );
}
