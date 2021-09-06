import Div100vh from "react-div-100vh";

import { Stack, StackProps,CircularProgress, Typography } from "@material-ui/core";
interface ILoadingProps extends Partial<StackProps> {
  message?: string;
  fullScreen?: boolean;
}

export default function Loading({
  message = "Loading",
  fullScreen = false,
  ...props
}: ILoadingProps) {
  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      component={fullScreen ? Div100vh : "div"}
      {...props}
      style={{
        width: "100%",
        height: fullScreen ? "100rvh" : "100%",
        alignItems: "center",
        ...props.style,
      }}
    >
      <CircularProgress sx={{ color: "action.active", mb: 1 }} />
      <Typography variant="h6" component="div" style={{ userSelect: "none" }}>
        {message}
      </Typography>
    </Stack>
  );
}
