import { useState } from "react";

import SetupLayout from "@src/components/Setup/SetupLayout";
import StepWelcome from "@src/components/Setup/RowyAppSetup/StepWelcome";
import StepOauth from "@src/components/Setup/RowyAppSetup/StepOauth";
import StepProject from "@src/components/Setup/RowyAppSetup/StepProject";
import StepRules from "@src/components/Setup/RowyAppSetup/StepRules";
import StepStorageRules from "@src/components/Setup/BasicSetup/StepStorageRules";
import StepFinish from "@src/components/Setup/BasicSetup/StepFinish";

const steps = [
  StepWelcome,
  StepOauth,
  StepProject,
  StepRules,
  StepStorageRules,
  StepFinish,
];

export default function RowyAppSetupPage() {
  const [completion, setCompletion] = useState<Record<string, boolean>>({
    welcome: false,
    rules: false,
    storageRules: false,
  });

  return (
    <SetupLayout
      steps={steps}
      completion={completion}
      setCompletion={setCompletion}
    />
  );
}
