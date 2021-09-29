import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import GoIcon from "assets/icons/Go";
import HomeIcon from "@mui/icons-material/HomeOutlined";

import AuthLayout from "components/Auth/AuthLayout";
import Navigation, { APP_BAR_HEIGHT } from "components/Navigation";
import EmptyState from "components/EmptyState";

import { homepage } from "@root/package.json";
import { useAppContext } from "contexts/AppContext";
import routes from "constants/routes";

export interface IPageNotFoundProps {}

export default function PageNotFound() {
  const { currentUser } = useAppContext();

  if (!currentUser)
    return (
      <AuthLayout title="Page not found">
        <Button
          variant="outlined"
          sx={{ mt: 3 }}
          href={homepage}
          endIcon={<GoIcon style={{ margin: "0 -0.33em" }} />}
        >
          {homepage.split("//")[1].replace(/\//g, "")}
        </Button>
      </AuthLayout>
    );

  return (
    <Navigation title="Page not found" titleComponent={() => <div />}>
      <EmptyState
        message="Page not found"
        description={
          <Button
            variant="outlined"
            sx={{ mt: 3 }}
            component={Link}
            to={routes.home}
            startIcon={<HomeIcon />}
          >
            Home
          </Button>
        }
        fullScreen
        style={{ marginTop: -APP_BAR_HEIGHT }}
      />
    </Navigation>
  );
}
