import { useSearch } from "react-use-search";

import { Container, Stack, Typography, Paper, List } from "@material-ui/core";

import FloatingSearch from "components/FloatingSearch";
import UserItem from "components/Settings/UserManagement/UserItem";
import UserSkeleton from "components/Settings/UserManagement/UserSkeleton";

import useCollection from "hooks/useCollection";
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
  const loading = usersState.loading || !Array.isArray(usersState.documents);

  const [filteredUsers, query, handleChange] = useSearch<User>(
    usersState.documents ?? [],
    (user, query) =>
      user.id === query ||
      user.user.displayName.includes(query) ||
      user.user.email.includes(query),
    { filter: true, debounce: 200 }
  );

  return (
    <Container maxWidth="sm" sx={{ px: 1, pt: 2, pb: 7 }}>
      <FloatingSearch label="Search Users" onChange={handleChange as any} />

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
              ? `${filteredUsers.length} of ${usersState.documents.length}`
              : usersState.documents.length}
          </Typography>
        )}
      </Stack>

      <Paper>
        <List>
          {loading || (query === "" && filteredUsers.length === 0) ? (
            <>
              <UserSkeleton />
              <UserSkeleton />
              <UserSkeleton />
            </>
          ) : (
            filteredUsers.map((user) => <UserItem key={user.id} {...user} />)
          )}
        </List>
      </Paper>
    </Container>
  );
}
