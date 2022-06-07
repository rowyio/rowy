import { useEffect, useRef } from "react";
import useStateRef from "react-usestateref";
import { throttle } from "lodash-es";

import { Box } from "@mui/material";

import BuildLogRow from "./BuildLogRow";
import CircularProgressOptical from "@src/components/CircularProgressOptical";

import { isTargetInsideBox } from "@src/utils/ui";

export interface IBuildLogListProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  logs: Record<string, any>[];
  status: string;
  value: number;
  index: number;
}

export default function BuildLogList({
  logs,
  status,
  value,
  index,
  ...props
}: IBuildLogListProps) {
  // useStateRef is necessary to resolve the state syncing issue
  // https://stackoverflow.com/a/63039797/12208834
  const [liveStreaming, setLiveStreaming, liveStreamingStateRef] =
    useStateRef(true);
  const liveStreamingRef = useRef<any>();
  const isActive = value === index;

  const handleScroll = throttle(() => {
    const target = document.querySelector("#live-stream-target")!;
    const scrollBox = document.querySelector("#live-stream-scroll-box")!;
    const liveStreamTargetVisible = isTargetInsideBox(target, scrollBox);
    if (liveStreamTargetVisible !== liveStreamingStateRef.current) {
      setLiveStreaming(liveStreamTargetVisible);
    }
  }, 500);

  const scrollToLive = () => {
    const liveStreamTarget = document.querySelector("#live-stream-target");
    liveStreamTarget?.scrollIntoView?.({
      behavior: "smooth",
    });
  };

  useEffect(() => {
    if (liveStreaming && isActive && status === "BUILDING") {
      if (!liveStreamingRef.current) {
        scrollToLive();
      } else {
        setTimeout(scrollToLive, 100);
      }
    }
  }, [logs, value]);

  useEffect(() => {
    if (isActive) {
      const liveStreamScrollBox = document.querySelector(
        "#live-stream-scroll-box"
      );
      liveStreamScrollBox!.addEventListener("scroll", () => {
        handleScroll();
      });
    }
  }, [value]);

  return (
    <div
      role="tabpanel"
      hidden={!isActive}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...props}
      style={{
        width: "100%",
        backgroundColor: "#1E1E1E",
        ...props.style,
      }}
    >
      {value === index && (
        <Box
          p={3}
          style={{ overflowY: "auto", maxHeight: "100%" }}
          id="live-stream-scroll-box"
        >
          {Array.isArray(logs) &&
            logs.map((log, index) => (
              <BuildLogRow logRecord={log} index={index} key={index} />
            ))}
          <div ref={liveStreamingRef} id="live-stream-target">
            {status === "BUILDING" && (
              <CircularProgressOptical sx={{ ml: 4, mt: 2 }} size={30} />
            )}
          </div>
          <div style={{ height: 10 }} />
        </Box>
      )}
    </div>
  );
}
