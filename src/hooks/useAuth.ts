import { useEffect, useState } from "react";
import { auth } from "../firebase";

const useAuth = () => {
  const [authUser, setAuthUser] = useState<firebase.User | null | undefined>(
    undefined
  );

  useEffect(() => {
    auth.onAuthStateChanged(user => {
      setAuthUser(user);
    });
  }, []);

  return authUser;
};

export default useAuth;
