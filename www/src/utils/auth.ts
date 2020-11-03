import { auth, googleProvider } from "../firebase";

export const handleGoogleAuth = async (
  success: Function,
  fail: Function,
  email?: string
) => {
  try {
    const authUser = await auth.signInWithPopup(googleProvider);
    if (!authUser.user) throw Error("Failed to authenticate");
    if (email && email.toLowerCase() !== authUser.user.email?.toLowerCase())
      throw Error(`Used account is not ${email}`);
    const result = await authUser.user.getIdTokenResult();
    if (result.claims.roles && result.claims.roles.length !== 0) {
      success(authUser, result.claims.roles);
    } else {
      throw Error("This account does not have any roles");
    }
  } catch (error) {
    if (auth.currentUser) {
      auth.signOut();
    }
    fail(error);
  }
};
export const signOut = () => {
  if (auth.currentUser) {
    auth.signOut();
  }
};
