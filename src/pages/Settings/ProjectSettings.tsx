import { Container, Typography } from "@material-ui/core";

import Navigation from "components/Navigation";

export default function ProjectSettings() {
  return (
    <Navigation title="Project Settings">
      <Container style={{ height: "200vh" }}>
        <Typography component="h2" variant="h4">
          Project Settings
        </Typography>
      </Container>
    </Navigation>
  );
}
