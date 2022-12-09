import { useAtom } from "jotai";
import { FallbackProps } from "react-error-boundary";
import { Link } from "react-router-dom";

import {
  Typography,
  Stack,
  Avatar,
  Alert,
  Divider,
  Link as MuiLink,
  Button,
} from "@mui/material";
import LockIcon from "@mui/icons-material/LockOutlined";

import EmptyState from "@src/components/EmptyState";

import {
  projectScope,
  currentUserAtom,
  userRolesAtom,
} from "@src/atoms/projectScope";
import { WIKI_LINKS } from "@src/constants/externalLinks";
import { ROUTES } from "@src/constants/routes";

export default function AccessDenied({ resetErrorBoundary }: FallbackProps) {
  const [currentUser] = useAtom(currentUserAtom, projectScope);
  const [userRoles] = useAtom(userRolesAtom, projectScope);

  if (!currentUser) window.location.reload();

  return (
    <EmptyState
      role="alert"
      fullScreen
      Icon={LockIcon}
      message="Access denied"
      description={
        <>
          <div style={{ textAlign: "left", width: "100%" }}>
            <Stack
              direction="row"
              spacing={1.25}
              alignItems="flex-start"
              sx={{ mt: 2 }}
            >
              <Avatar src={currentUser?.photoURL || ""} />
              <div>
                <Typography>{currentUser?.displayName}</Typography>
                <Typography variant="button">{currentUser?.email}</Typography>
              </div>
            </Stack>

            {(!userRoles || userRoles.length === 0) && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                Your account has no roles set
              </Alert>
            )}
          </div>

          <Typography>
            You do not have access to this project. Please contact the project
            owner.
          </Typography>

          <Button
            component={Link}
            to={ROUTES.signOut}
            onClick={() => resetErrorBoundary()}
          >
            Sign out
          </Button>

          <Divider flexItem sx={{ typography: "overline" }}>
            OR
          </Divider>

          <Typography>
            If you are the project owner, please follow{" "}
            <MuiLink
              href={WIKI_LINKS.setupRoles}
              target="_blank"
              rel="noopener noreferrer"
            >
              these instructions
            </MuiLink>{" "}
            to set up this project’s security rules.
          </Typography>
        </>
      }
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bgcolor: "background.default",
        zIndex: 9999,
      }}
    />
  );
}
