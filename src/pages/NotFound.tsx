import { useAtom } from "jotai";
import { Link } from "react-router-dom";

import { Button } from "@mui/material";
import GoIcon from "@src/assets/icons/Go";
import HomeIcon from "@mui/icons-material/HomeOutlined";

import AuthLayout from "@src/layouts/AuthLayout";
import Navigation, { APP_BAR_HEIGHT } from "@src/layouts/Navigation";
import EmptyState from "@src/components/EmptyState";

import meta from "@root/package.json";
import { ROUTES } from "@src/constants/routes";
import { globalScope, currentUserAtom } from "@src/atoms/globalScope";

export default function NotFound() {
  const [currentUser] = useAtom(currentUserAtom, globalScope);

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
              startIcon={<HomeIcon />}
            >
              Home
            </Button>
          }
          style={{ marginTop: -APP_BAR_HEIGHT }}
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
