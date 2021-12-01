import { Route, RouteProps, Redirect } from "react-router-dom";

import { useAppContext } from "@src/contexts/AppContext";
import Loading from "@src/components/Loading";
import routes from "@src/constants/routes";

interface IPrivateRouteProps extends RouteProps {
  render: NonNullable<RouteProps["render"]>;
}

export default function PrivateRoute({ render, ...props }: IPrivateRouteProps) {
  const { currentUser } = useAppContext();

  if (!!currentUser) return <Route {...props} render={render} />;

  const redirect =
    (props.location?.pathname ?? "") +
    (props.location?.search ?? "") +
    (props.location?.hash ?? "");

  if (currentUser === null)
    return (
      <Redirect
        to={{
          pathname: routes.auth,
          search: redirect ? `?redirect=${encodeURIComponent(redirect)}` : "",
        }}
      />
    );

  return (
    <Route
      {...props}
      render={() => <Loading message="Authenticating" fullScreen />}
    />
  );
}
