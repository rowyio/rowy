import React from "react";

interface AuthContextInterface {
  currentUser: firebase.User | null | undefined;
}

const AuthContext = React.createContext<AuthContextInterface>({
  currentUser: undefined,
});

export default AuthContext;
