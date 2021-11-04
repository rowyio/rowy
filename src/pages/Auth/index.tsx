import { useLocation } from "react-router-dom";
import queryString from "query-string";

import AuthLayout from "@src/components/Auth/AuthLayout";
import FirebaseUi from "@src/components/Auth/FirebaseUi";

export default function AuthPage() {
  const { search } = useLocation();
  const parsed = queryString.parse(search);

  const uiConfig: firebaseui.auth.Config = {};
  if (typeof parsed.redirect === "string" && parsed.redirect.length > 0) {
    uiConfig.signInSuccessUrl = parsed.redirect;
  }

  return (
    <AuthLayout title="Sign in">
      <FirebaseUi uiConfig={uiConfig} />
    </AuthLayout>
  );
}
