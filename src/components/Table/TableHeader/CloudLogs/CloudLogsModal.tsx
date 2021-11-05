import useSWR from "swr";

import { Button, LinearProgress } from "@mui/material";
// import LoadingButton from "@mui/lab/LoadingButton";

import Modal, { IModalProps } from "@src/components/Modal";
import CloudLogList from "./CloudLogList";

import { useProjectContext } from "@src/contexts/ProjectContext";

export default function CloudLogsModal(props: IModalProps) {
  const { rowyRun } = useProjectContext();

  const { data, mutate, isValidating } = useSWR(
    "logItems",
    () =>
      rowyRun
        ? rowyRun<Record<string, any>[]>({
            route: {
              // path: "/logs",
              // path: '/logs?filter=resource.labels.function_name="R-githubStars"',
              path: `/logs?filter=logName="${encodeURIComponent(
                "projects/rowyio/logs/rowy-audit"
              )}"`,
              method: "GET",
            },
          })
        : [],
    {
      fallbackData: [],
      revalidateOnMount: true,
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  return (
    <Modal
      {...props}
      maxWidth="xl"
      fullWidth
      fullHeight
      ScrollableDialogContentProps={{ disableBottomDivider: true }}
    >
      <Button onClick={() => mutate()}>Refresh</Button>

      {isValidating && (
        <LinearProgress
          style={{
            position: "absolute",
            top: "calc(var(--dialog-title-height) + 1px)",
            transform: "translateY(-100%)",
            left: 0,
            right: 0,
            borderRadius: 0,
            marginTop: 0,
          }}
        />
      )}

      {Array.isArray(data) && <CloudLogList items={data} sx={{ mx: -1.5 }} />}
    </Modal>
  );
}
