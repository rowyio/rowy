import { use100vh } from "react-div-100vh";

import { Fade, Stack, StackProps, Typography } from "@mui/material";
import CircularProgressOptical from "@src/components/CircularProgressOptical";

interface ILoadingProps extends Partial<StackProps> {
  message?: string;
  fullScreen?: boolean;
  timeout?: number;
  delay?: number;
}

export default function Loading({
  message = "Loading",
  fullScreen = false,
  timeout = 1000,
  delay = 1000,
  ...props
}: ILoadingProps) {
  const fullScreenHeight = use100vh() ?? "100vh";

  return (
    <Fade
      in
      timeout={timeout}
      style={{ transitionDelay: `${delay}ms` }}
      unmountOnExit
    >
      <Stack
        justifyContent="center"
        alignItems="center"
        spacing={1}
        {...props}
        style={{
          width: "100%",
          height: fullScreen ? fullScreenHeight : "100%",
          alignItems: "center",
          ...props.style,
        }}
      >
        <CircularProgressOptical />
        <Typography
          variant="subtitle1"
          component="div"
          style={{ userSelect: "none" }}
        >
          {message}
        </Typography>
      </Stack>
    </Fade>
  );
}
