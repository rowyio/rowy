import React from "react";
import EmptyState, { IEmptyStateProps } from "./EmptyState";

import { Button } from "@material-ui/core";
import ReloadIcon from "@material-ui/icons/Refresh";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import meta from "../../package.json";
class ErrorBoundary extends React.Component<IEmptyStateProps> {
  state = { hasError: false, errorMessage: "" };

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, errorMessage: error.message };
  }

  componentDidCatch(error: Error, errorInfo: object) {
    console.log(error, errorInfo);
    // You can also log the error to an error reporting service
    //logErrorToMyService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <EmptyState
          message="Something Went Wrong"
          description={
            <>
              <span>{this.state.errorMessage}</span>
              {this.state.errorMessage.startsWith("Loading chunk") ? (
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<ReloadIcon />}
                  onClick={() => window.location.reload()}
                >
                  Reload
                </Button>
              ) : (
                <Button
                  href={
                    meta.repository.url.replace(".git", "") +
                    "/issues/new/choose"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  endIcon={<OpenInNewIcon />}
                >
                  Report Issue
                </Button>
              )}
            </>
          }
          fullScreen
          {...this.props}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
