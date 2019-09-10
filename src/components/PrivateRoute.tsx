import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import AuthContext from "../contexts/authContext";

const PrivateRoute = ({ component: RouteComponent, ...rest }: any) => {
  const { currentUser } = useContext(AuthContext);
  console.log(currentUser);
  return (
    <Route
      {...rest}
      render={routeProps =>
        !!currentUser ? (
          <RouteComponent {...routeProps} />
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
