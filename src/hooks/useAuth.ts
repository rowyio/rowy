import { useEffect, useState } from "react";
import { auth } from "../firebase";

const useAuth = () => {
  const [authUser, setAuthUser] = useState<firebase.User | null | undefined>(
    undefined
  );

  useEffect(() => {
    auth.onAuthStateChanged(token => {
      setAuthUser(token);
    });
  }, []);

  return authUser;
};

export default useAuth;
