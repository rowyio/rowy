import { Suspense } from "react";
import { useAtom } from "jotai";
import { TransitionGroup } from "react-transition-group";

import {
  Container,
  Stack,
  Typography,
  Paper,
  List,
  Fade,
  Collapse,
} from "@mui/material";

import FloatingSearch from "@src/components/FloatingSearch";
import SlideTransition from "@src/components/Modal/SlideTransition";
import UserItem from "@src/components/Settings/UserManagement/UserItem";
import UserSkeleton from "@src/components/Settings/UserManagement/UserSkeleton";
import InviteUser from "@src/components/Settings/UserManagement/InviteUser";

import { projectScope, allUsersAtom } from "@src/atoms/projectScope";
import useBasicSearch from "@src/hooks/useBasicSearch";

const SEARCH_KEYS = ["id", "user.displayName", "user.email"];

function MembersPage() {
  const [users] = useAtom(allUsersAtom, projectScope);
  const [results, query, handleQuery] = useBasicSearch(users, SEARCH_KEYS);

  return (
    <Container maxWidth="sm" sx={{ px: 1, pt: 1, pb: 7 + 3 + 3 }}>
      <FloatingSearch
        label="Search users"
        onChange={(e) => handleQuery(e.target.value)}
      />

      <SlideTransition in timeout={100}>
        <Stack
          direction="row"
          spacing={2}
          justifyContent="space-between"
          alignItems="flex-end"
          sx={{ mt: 4, ml: 1, mb: 0.5, cursor: "default" }}
        >
          <Typography variant="subtitle1" component="h2">
            {query ? `${results.length} of ${users.length}` : users.length} user
            {results.length !== 1 && "s"}
          </Typography>

          <InviteUser />
        </Stack>
      </SlideTransition>

      <SlideTransition in timeout={100 + 50}>
        <Paper>
          <List sx={{ py: { xs: 0, sm: 1.5 }, px: { xs: 0, sm: 1 } }}>
            <TransitionGroup>
              {results.map((user) => (
                <Collapse key={user._rowy_ref!.id}>
                  <UserItem {...user} />
                </Collapse>
              ))}
            </TransitionGroup>
          </List>
        </Paper>
      </SlideTransition>
    </Container>
  );
}

export default function SuspendedMembersPage() {
  return (
    <Suspense
      fallback={
        <Fade in timeout={1000} style={{ transitionDelay: "1s" }} unmountOnExit>
          <Container maxWidth="sm" sx={{ px: 1, pt: 1, pb: 7 + 3 + 3 }}>
            <FloatingSearch label="Search users" disabled />

            <Stack
              direction="row"
              spacing={2}
              justifyContent="space-between"
              alignItems="flex-end"
              sx={{ mt: 4, ml: 1 }}
            >
              <Typography
                variant="subtitle1"
                component="p"
                color="text.disabled"
                sx={{ lineHeight: "32px" }}
              >
                Loading users…
              </Typography>
            </Stack>

            <Paper>
              <List sx={{ py: { xs: 0, sm: 1.5 }, px: { xs: 0, sm: 1 } }}>
                <UserSkeleton />
                <UserSkeleton />
                <UserSkeleton />
              </List>
            </Paper>
          </Container>
        </Fade>
      }
    >
      <MembersPage />
    </Suspense>
  );
}
