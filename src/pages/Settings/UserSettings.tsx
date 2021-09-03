import { Container, Stack } from "@material-ui/core";

import SettingsSection from "components/Settings/SettingsSection";

export default function UserSettingsPage() {
  return (
    <Container maxWidth="sm" sx={{ px: 1, pt: 2, pb: 7 }}>
      <Stack spacing={4}>
        <SettingsSection title="Your Account">TODO:</SettingsSection>
      </Stack>
    </Container>
  );
}
