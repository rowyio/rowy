import {
  Container,
  Stack,
  Typography,
  Paper,
  List,
  Fade,
} from "@material-ui/core";

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
        label="Search Users"
        onChange={(e) => handleQuery(e.target.value)}
      />

      <SlideTransition in timeout={100}>
        <Stack
          direction="row"
          spacing={2}
          justifyContent="space-between"
          alignItems="baseline"
          sx={{ mt: 4, mx: 1, mb: 0.5, cursor: "default" }}
        >
          <Typography variant="subtitle1" component="h2">
            Users
          </Typography>
          {!loading && (
            <Typography variant="button" component="div">
              {query
                ? `${results.length} of ${usersState.documents.length}`
                : usersState.documents.length}
            </Typography>
          )}
        </Stack>
      </SlideTransition>

      {loading || (query === "" && results.length === 0) ? (
        <Fade in style={{ transitionDelay: "1s" }} unmountOnExit>
          <Paper>
            <List>
              <UserSkeleton />
              <UserSkeleton />
              <UserSkeleton />
            </List>
          </Paper>
        </Fade>
      ) : (
        <SlideTransition in timeout={100 + 50}>
          <Paper>
            <List>
              {results.map((user) => (
                <UserItem key={user.id} {...user} />
              ))}
            </List>
          </Paper>
        </SlideTransition>
      )}

      <InviteUser />
    </Container>
  );
}
