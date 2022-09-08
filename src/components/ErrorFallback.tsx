import { useState, useEffect } from "react";
import { FallbackProps } from "react-error-boundary";
import { useLocation, Link } from "react-router-dom";

import { Typography, Button } from "@mui/material";
import ReloadIcon from "@mui/icons-material/Refresh";
import InlineOpenInNewIcon from "@src/components/InlineOpenInNewIcon";
import { Tables as TablesIcon } from "@src/assets/icons";

import EmptyState, { IEmptyStateProps } from "@src/components/EmptyState";
import AccessDenied from "@src/components/AccessDenied";

import { ROUTES } from "@src/constants/routes";
import meta from "@root/package.json";

export const ERROR_TABLE_NOT_FOUND = "Table not found";

export interface IErrorFallbackProps extends FallbackProps, IEmptyStateProps {}

export function ErrorFallbackContents({
  error,
  resetErrorBoundary,
  ...props
}: IErrorFallbackProps) {
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
          {error.message}
        </Typography>
        <Button
          size={props.basic ? "small" : "medium"}
          href={
            meta.repository.url.replace(".git", "") +
            "/issues/new?labels=bug&template=bug_report.md&title=Error: " +
            error.message.replace("\n", " ")
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
    renderProps = {
      message: ERROR_TABLE_NOT_FOUND,
      description: (
        <>
          <Typography variant="inherit">
            Make sure you have the right ID
          </Typography>
          <code>{error.message.replace(ERROR_TABLE_NOT_FOUND + ": ", "")}</code>
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

  if (error.message.startsWith("Loading chunk")) {
    renderProps = {
      Icon: ReloadIcon,
      message: "New update available",
      description: (
        <>
          <Typography variant="inherit">
            Reload this page to get the latest update
          </Typography>
          <Button
            size={props.basic ? "small" : "medium"}
            variant="outlined"
            color="secondary"
            startIcon={<ReloadIcon />}
            onClick={() => window.location.reload()}
          >
            Reload
          </Button>
        </>
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
