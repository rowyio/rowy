import React from "react";
import EmptyState, { IEmptyStateProps } from "./EmptyState";

import { Stack, Button } from "@material-ui/core";
import ReloadIcon from "@material-ui/icons/Refresh";
class ErrorBoundary extends React.Component<IEmptyStateProps> {
  state = { hasError: false, errorMessage: "" };

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    // Special error message for chunk loading failures:
    if (error.message.startsWith("Loading chunk"))
      return {
        hasError: true,
        errorMessage: (
          <Stack spacing={2} alignItems="center">
            <span>{error.message}</span>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<ReloadIcon />}
              onClick={() => window.location.reload()}
            >
              Reload
            </Button>
          </Stack>
        ),
      };

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
          description={this.state.errorMessage}
          fullScreen
          {...this.props}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
