import { use100vh } from "react-div-100vh";

import {
  Fade,
  Stack,
  StackProps,
  CircularProgress,
  Typography,
} from "@material-ui/core";
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
    <Fade in style={{ transitionDelay: "1s" }} unmountOnExit>
      <Stack
        justifyContent="center"
        alignItems="center"
        {...props}
        style={{
          width: "100%",
          height: fullScreen ? fullScreenHeight : "100%",
          alignItems: "center",
          ...props.style,
        }}
      >
        <CircularProgress sx={{ color: "action.active", mb: 1 }} />
        <Typography variant="h6" component="div" style={{ userSelect: "none" }}>
          {message}
        </Typography>
      </Stack>
    </Fade>
  );
}
