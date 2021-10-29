import { use100vh } from "react-div-100vh";

import { Fade, Stack, StackProps, Typography } from "@mui/material";
import CircularProgressOptical from "@src/components/CircularProgressOptical";

interface ILoadingProps extends Partial<StackProps> {
  message?: string;
  fullScreen?: boolean;
}

export default function Loading({
  message = "Loading",
  fullScreen = false,
  ...props
}: ILoadingProps) {
  const fullScreenHeight = use100vh() ?? "100vh";

  return (
    <Fade in timeout={1000} style={{ transitionDelay: "1s" }} unmountOnExit>
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
