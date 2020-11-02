import { auth } from "./credentials";

export const authenticateUser = async (page, email = "shams@antler.co") => {
  const user = await auth.getUserByEmail(email);
  const jwt = await auth.createCustomToken(user.uid);
  // Go to http://localhost:3000/jwtAuth
  await page.goto("http://localhost:3000/jwtAuth");

  // Click input[name="JWT"]
  await page.click('input[name="JWT"]');

  // Fill input[name="JWT"]
  await page.fill('input[name="JWT"]', jwt);

  // Click text="Sign in"
  return await Promise.all([
    page.waitForNavigation(/*{ url: 'http://localhost:3000/' }*/),
    page.click('text="Sign in"'),
  ]);
};
