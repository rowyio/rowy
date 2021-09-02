import { Container, Typography } from "@material-ui/core";

import Navigation from "components/Navigation";

export default function UserSettings() {
  return (
    <Navigation title="Settings">
      <Container>
        <Typography component="h2" variant="h4">
          Settings
        </Typography>
      </Container>
    </Navigation>
  );
}
