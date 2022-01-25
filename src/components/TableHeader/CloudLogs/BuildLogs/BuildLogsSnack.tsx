import { useEffect, useRef, useState } from "react";
import useStateRef from "react-usestateref";
import _throttle from "lodash/throttle";
import { useAtom } from "jotai";

import { Typography, Box, Tooltip, IconButton } from "@mui/material";
import ExpandIcon from "@mui/icons-material/ExpandLess";
import CollapseIcon from "@mui/icons-material/ExpandMore";
import OpenIcon from "@mui/icons-material/Fullscreen";
import CloseIcon from "@mui/icons-material/Close";

import BuildLogRow from "./BuildLogRow";
import CircularProgressOptical from "@src/components/CircularProgressOptical";

import { isTargetInsideBox } from "utils/fns";
import { useSnackLogContext } from "@src/contexts/SnackLogContext";
import useBuildLogs from "./useBuildLogs";
import { modalAtom } from "@src/atoms/Table";
import { cloudLogFiltersAtom } from "../utils";

export interface IBuildLogsSnackProps {
  onClose: () => void;
  onOpenPanel: () => void;
}

export default function BuildLogsSnack({ onClose, onOpenPanel }) {
  const snackLogContext = useSnackLogContext();
  const { latestLog } = useBuildLogs();
  const [, setModal] = useAtom(modalAtom);
  const [, setCloudLogFilters] = useAtom(cloudLogFiltersAtom);
  const latestActiveLog =
    latestLog?.startTimeStamp > snackLogContext.latestBuildTimestamp - 5000 ||
    latestLog?.startTimeStamp > snackLogContext.latestBuildTimestamp + 5000
      ? latestLog
      : null;
  const logs = latestActiveLog?.fullLog;
  const status = latestActiveLog?.status;

  const [expanded, setExpanded] = useState(false);
  const [liveStreaming, setLiveStreaming, liveStreamingStateRef] =
    useStateRef(true);
  const liveStreamingRef = useRef<any>();

  const handleScroll = _throttle(() => {
    const target = document.querySelector("#live-stream-target-snack");
    const scrollBox = document.querySelector("#live-stream-scroll-box-snack");
    const liveStreamTargetVisible =
      target && scrollBox && isTargetInsideBox(target, scrollBox);
    if (liveStreamTargetVisible !== liveStreamingStateRef.current) {
      setLiveStreaming(liveStreamTargetVisible);
    }
  }, 100);

  const scrollToLive = () => {
    const liveStreamTarget = document.querySelector(
      "#live-stream-target-snack"
    );
    liveStreamTarget?.scrollIntoView?.();
  };

  useEffect(() => {
    if (liveStreaming && status === "BUILDING") {
      if (!liveStreamingRef.current) {
        scrollToLive();
      } else {
        setTimeout(scrollToLive, 500);
      }
    }
  }, [latestActiveLog]);

  useEffect(() => {
    const liveStreamScrollBox = document.querySelector(
      "#live-stream-scroll-box-snack"
    );
    liveStreamScrollBox!.addEventListener("scroll", () => {
      handleScroll();
    });
  }, []);

  return (
    <Box
      sx={{
        position: "absolute",
        left: (theme) => theme.spacing(2),
        bottom: (theme) => theme.spacing(2),
        backgroundColor: "#282829",
        boxShadow: 6,
        color: "#fff",
        width: 650,
        p: 2,
        pt: 1,
        borderRadius: 1,
        zIndex: 1,
        transition: (theme) => theme.transitions.create("height"),
        height: expanded ? "calc(100% - 300px)" : 300,
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography
          variant="subtitle2"
          color={
            latestActiveLog?.status === "SUCCESS"
              ? "success.light"
              : latestActiveLog?.status === "FAIL"
              ? "error.light"
              : ""
          }
        >
          {!latestActiveLog && "Build pending…"}
          {latestActiveLog?.status === "SUCCESS" && "Build success"}
          {latestActiveLog?.status === "FAIL" && "Build failed"}
          {latestActiveLog?.status === "BUILDING" && "Building…"}
        </Typography>

        <Box>
          <Tooltip title="Expand">
            <IconButton
              aria-label="Expand"
              size="small"
              onClick={() => setExpanded(!expanded)}
              style={{ color: "white" }}
            >
              {expanded ? <CollapseIcon /> : <ExpandIcon />}
            </IconButton>
          </Tooltip>

          <Tooltip title="Full screen">
            <IconButton
              aria-label="Full screen"
              size="small"
              onClick={() => {
                setModal("cloudLogs");
                setCloudLogFilters({
                  type: "build",
                  timeRange: { type: "days", value: 7 },
                  buildLogExpanded: 0,
                });
              }}
              style={{ color: "white" }}
            >
              <OpenIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Close">
            <IconButton
              aria-label="Close"
              size="small"
              onClick={onClose}
              style={{ color: "white" }}
            >
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Box
        sx={{
          overflowY: "scroll",
          maxHeight: "100%",
        }}
        height={"calc(100% - 25px)"}
        id="live-stream-scroll-box-snack"
      >
        {latestActiveLog && (
          <>
            {logs?.map((log, index) => (
              <BuildLogRow logRecord={log} index={index} key={index} />
            ))}
            <div ref={liveStreamingRef} id="live-stream-target-snack">
              {status === "BUILDING" && (
                <CircularProgressOptical sx={{ ml: 4, mt: 2 }} size={30} />
              )}
            </div>
            <div style={{ height: 10 }} />
          </>
        )}
      </Box>
    </Box>
  );
}
