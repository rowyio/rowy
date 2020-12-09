import React, { useContext } from "react";
import { Route, RouteProps, Redirect } from "react-router-dom";

import { AppContext } from "contexts/AppContext";
import Loading from "../components/Loading";

interface IPrivateRouteProps extends RouteProps {
  render: NonNullable<RouteProps["render"]>;
}

const PrivateRoute: React.FC<IPrivateRouteProps> = ({ render, ...rest }) => {
  const { currentUser } = useContext(AppContext);

  if (!!currentUser) return <Route {...rest} render={render} />;

  if (currentUser === null) return <Redirect to="/auth" />;

  return (
    <Route
      {...rest}
      render={() => <Loading message="Authenticating" fullScreen />}
    />
  );
};

export default PrivateRoute;
