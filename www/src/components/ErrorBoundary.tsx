import React from "react";
import EmptyState, { IEmptyStateProps } from "./EmptyState";

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
