import { useSearchParams } from "react-router-dom";

import AuthLayout from "@src/layouts/AuthLayout";
import FirebaseUi from "@src/components/FirebaseUi";

export default function AuthPage() {
  const [searchParams] = useSearchParams();

  const uiConfig: firebaseui.auth.Config = {};
  const redirect = searchParams.get("redirect");
  if (typeof redirect === "string" && redirect.length > 0) {
    uiConfig.signInSuccessUrl = redirect;
  }

  return (
    <AuthLayout title="Sign in">
      <FirebaseUi uiConfig={uiConfig} />
    </AuthLayout>
  );
}
