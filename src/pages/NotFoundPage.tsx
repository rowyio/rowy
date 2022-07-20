import { useAtom } from "jotai";
import { Link } from "react-router-dom";

import { Button } from "@mui/material";
import { Go as GoIcon, Tables as TablesIcon } from "@src/assets/icons";

import AuthLayout from "@src/layouts/AuthLayout";
import Navigation from "@src/layouts/Navigation";
import { TOP_BAR_HEIGHT } from "@src/layouts/Navigation/TopBar";
import EmptyState from "@src/components/EmptyState";

import meta from "@root/package.json";
import { ROUTES } from "@src/constants/routes";
import { projectScope, currentUserAtom } from "@src/atoms/projectScope";

export default function NotFound() {
  const [currentUser] = useAtom(currentUserAtom, projectScope);

  if (currentUser)
    return (
      <Navigation>
        <EmptyState
          fullScreen
          message="Page not found"
          description={
            <Button
              variant="outlined"
              sx={{ mt: 3 }}
              component={Link}
              to={ROUTES.home}
              startIcon={<TablesIcon />}
            >
              Tables
            </Button>
          }
          style={{ marginTop: -TOP_BAR_HEIGHT }}
        />
      </Navigation>
    );

  return (
    <AuthLayout title="Page not found" hideLinks={Boolean(currentUser)}>
      <Button
        variant="outlined"
        sx={{ mt: 3 }}
        href={meta.homepage}
        endIcon={<GoIcon style={{ margin: "0 -0.33em" }} />}
      >
        {meta.homepage.split("//")[1].replace(/\//g, "")}
      </Button>
    </AuthLayout>
  );
}
