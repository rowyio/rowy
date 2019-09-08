import React from "react";

interface AuthContextInterface {
  authUser: firebase.User | null | undefined;
}

const AuthContext = React.createContext<AuthContextInterface>({
  authUser: undefined
});

export default AuthContext;
