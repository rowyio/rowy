import { useState } from "react";

import SetupLayout from "@src/components/Setup/SetupLayout";
import StepWelcome from "@src/components/Setup/BasicSetup/StepWelcome";
import StepRules from "@src/components/Setup/BasicSetup/StepRules";
import StepStorageRules from "@src/components/Setup/BasicSetup/StepStorageRules";
import StepFinish from "@src/components/Setup/BasicSetup/StepFinish";

const steps = [StepWelcome, StepRules, StepStorageRules, StepFinish];

export default function BasicSetupPage() {
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
