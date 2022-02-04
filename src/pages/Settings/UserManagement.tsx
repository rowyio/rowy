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

import useCollection from "@src/hooks/useCollection";
import useBasicSearch from "@src/hooks/useBasicSearch";
import { USERS } from "@src/config/dbPaths";

const SEARCH_KEYS = ["id", "user.displayName", "user.email"];

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
