import { auth } from "@e2e/config/firebase-config";

export const getAuthToken = async (email: string) => {
  try {
    const user = await auth.getUserByEmail(email);
    const token = await auth.createCustomToken(user.uid);
    return token;
  } catch (e) {
    console.error(`User with ${email}, not found!`);
  }
  return;
};

export const listUsers = async () => {
  const users = await auth.listUsers();
  return users;
};
