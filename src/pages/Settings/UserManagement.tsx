import { Container, Stack } from "@material-ui/core";

import SettingsSection from "components/Settings/SettingsSection";

export default function UserManagement() {
  return (
    <Container maxWidth="sm" sx={{ px: 1, pt: 2, pb: 7 }}>
      <Stack spacing={4}>
        <SettingsSection title="Users">TODO:</SettingsSection>
      </Stack>
    </Container>
  );
}
