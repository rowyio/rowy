import React, { useContext } from "react";
import { Route, RouteProps, Redirect } from "react-router-dom";
import { AppContext } from "../AppProvider";

interface IPrivateRouteProps extends RouteProps {
  render: NonNullable<RouteProps["render"]>;
}

const PrivateRoute: React.FC<IPrivateRouteProps> = ({ render, ...rest }) => {
  const { currentUser } = useContext(AppContext);
  return (
    <Route
      {...rest}
      render={routeProps =>
        !!currentUser ? (
          render(routeProps)
        ) : currentUser === null ? (
          <Redirect to={"/auth"} />
        ) : (
          <p>authenticating</p>
        )
      }
    />
  );
};

export default PrivateRoute;
