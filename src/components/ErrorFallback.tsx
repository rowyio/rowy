import { FallbackProps } from "react-error-boundary";

import { Button } from "@mui/material";
import ReloadIcon from "@mui/icons-material/Refresh";
import InlineOpenInNewIcon from "@src/components/InlineOpenInNewIcon";

import EmptyState, { IEmptyStateProps } from "@src/components/EmptyState";
import meta from "@root/package.json";

export interface IErrorFallbackProps extends FallbackProps, IEmptyStateProps {}

export default function ErrorFallback({
  error,
  resetErrorBoundary,
  ...props
}: IErrorFallbackProps) {
  if (error.message.startsWith("Loading chunk"))
    return (
      <EmptyState
        Icon={ReloadIcon}
        message="New update available"
        description={
          <>
            <span>Reload this page to get the latest update</span>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<ReloadIcon />}
              onClick={() => window.location.reload()}
            >
              Reload
            </Button>
          </>
        }
        fullScreen
      />
    );

  return (
    <EmptyState
      message="Something went wrong"
      description={
        <>
          <span>{error.message}</span>
          <Button
            href={
              meta.repository.url.replace(".git", "") + "/issues/new/choose"
            }
            target="_blank"
            rel="noopener noreferrer"
          >
            Report issue
            <InlineOpenInNewIcon />
          </Button>
        </>
      }
      fullScreen
      {...props}
    />
  );
}
