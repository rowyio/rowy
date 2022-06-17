import { Outlet } from "react-router-dom";
import { Container, Typography } from "@mui/material";

export interface INavProps {}

export default function Nav(props: INavProps) {
  return (
    <Container>
      <Typography variant="h1">Nav</Typography>
      <Outlet />
    </Container>
  );
}
