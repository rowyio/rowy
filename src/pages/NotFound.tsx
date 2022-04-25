import { useAtom } from "jotai";
import { Link } from "react-router-dom";

import { Button } from "@mui/material";
import GoIcon from "@src/assets/icons/Go";
import HomeIcon from "@mui/icons-material/HomeOutlined";

import AuthLayout from "@src/layouts/AuthLayout";

import meta from "@root/package.json";
import routes from "@src/constants/routes";
import { globalScope } from "@src/atoms/globalScope";
import { currentUserAtom } from "@src/atoms/auth";

export default function NotFound() {
  const [currentUser] = useAtom(currentUserAtom, globalScope);

  return (
    <AuthLayout title="Page not found" hideLinks={Boolean(currentUser)}>
      {currentUser ? (
        <Button
          variant="outlined"
          sx={{ mt: 3 }}
          component={Link}
          to={routes.home}
          startIcon={<HomeIcon />}
        >
          Home
        </Button>
      ) : (
        <Button
          variant="outlined"
          sx={{ mt: 3 }}
          href={meta.homepage}
          endIcon={<GoIcon style={{ margin: "0 -0.33em" }} />}
        >
          {meta.homepage.split("//")[1].replace(/\//g, "")}
        </Button>
      )}
    </AuthLayout>
  );
}
