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

import FloatingSearch from "components/FloatingSearch";
import SlideTransition from "components/Modal/SlideTransition";
import UserItem from "components/Settings/UserManagement/UserItem";
import UserSkeleton from "components/Settings/UserManagement/UserSkeleton";
import InviteUser from "components/Settings/UserManagement/InviteUser";

import useCollection from "hooks/useCollection";
import useBasicSearch from "hooks/useBasicSearch";
import { USERS } from "config/dbPaths";

export interface User {
  id: string;
  user: {
    displayName: string;
    email: string;
    photoURL: string;
  };
  roles?: string[];
}

export default function UserManagementPage() {
  const [usersState] = useCollection({ path: USERS });
  const users: User[] = usersState.documents ?? [];
  const loading = usersState.loading || !Array.isArray(usersState.documents);

  const [results, query, handleQuery] = useBasicSearch(
    users,
    (user, query) =>
      user.id.toLowerCase() === query ||
      user.user.displayName.toLowerCase().includes(query) ||
      user.user.email.toLowerCase().includes(query)
  );

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
            {!loading && query
              ? `${results.length} of ${usersState.documents.length}`
              : usersState.documents.length}{" "}
            users
          </Typography>

          <InviteUser />
        </Stack>
      </SlideTransition>

      {loading || (query === "" && results.length === 0) ? (
        <Fade in timeout={1000} style={{ transitionDelay: "1s" }} unmountOnExit>
          <Paper>
            <List sx={{ py: { xs: 0, sm: 1.5 }, px: { xs: 0, sm: 1 } }}>
              <UserSkeleton />
              <UserSkeleton />
              <UserSkeleton />
            </List>
          </Paper>
        </Fade>
      ) : (
        <SlideTransition in timeout={100 + 50}>
          <Paper>
            <List sx={{ py: { xs: 0, sm: 1.5 }, px: { xs: 0, sm: 1 } }}>
              <TransitionGroup>
                {results.map((user) => (
                  <Collapse key={user.id}>
                    <UserItem {...user} />
                  </Collapse>
                ))}
              </TransitionGroup>
            </List>
          </Paper>
        </SlideTransition>
      )}
    </Container>
  );
}
