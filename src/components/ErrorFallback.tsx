import { useState, useEffect } from "react";
import { FallbackProps } from "react-error-boundary";
import { useLocation, Link } from "react-router-dom";

import { Button } from "@mui/material";
import ReloadIcon from "@mui/icons-material/Refresh";
import InlineOpenInNewIcon from "@src/components/InlineOpenInNewIcon";
import { Tables as TablesIcon } from "@src/assets/icons";

import EmptyState, { IEmptyStateProps } from "@src/components/EmptyState";
import AccessDenied from "@src/components/AccessDenied";

import { ROUTES } from "@src/constants/routes";
import meta from "@root/package.json";

export const ERROR_TABLE_NOT_FOUND = "Table not found";

export interface IErrorFallbackProps extends FallbackProps, IEmptyStateProps {}

export default function ErrorFallback({
  error,
  resetErrorBoundary,
  ...props
}: IErrorFallbackProps) {
  // Reset error boundary when navigating away from the page
  const location = useLocation();
  const [errorPathname] = useState(location.pathname);
  useEffect(() => {
    if (errorPathname !== location.pathname) resetErrorBoundary();
  }, [errorPathname, location.pathname, resetErrorBoundary]);

  if ((error as any).code === "permission-denied")
    return (
      <AccessDenied error={error} resetErrorBoundary={resetErrorBoundary} />
    );

  let renderProps: Partial<IEmptyStateProps> = {
    message: "Something went wrong",
    description: (
      <>
        <span>
          {(error as any).code && <b>{(error as any).code}: </b>}
          {error.message}
        </span>
        <Button
          size={props.basic ? "small" : "medium"}
          href={meta.repository.url.replace(".git", "") + "/issues/new/choose"}
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
          <span>Make sure you have the right ID</span>
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
          <span>Reload this page to get the latest update</span>
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

  return <EmptyState fullScreen {...renderProps} {...props} />;
}

export function InlineErrorFallback(props: IErrorFallbackProps) {
  return (
    <ErrorFallback
      {...props}
      fullScreen={false}
      basic
      wrap="nowrap"
      sx={{ typography: "body2" }}
    />
  );
}

export function NonFullScreenErrorFallback(props: IErrorFallbackProps) {
  return <ErrorFallback {...props} fullScreen={false} />;
}
