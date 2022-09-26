import Step1Import from "./Step1Import";
import Step2Add from "./Step2Add";
import Step3Invite from "./Step3Invite";
import Step4Code from "./Step4Code";
import Step5Finish from "./Step5Finish";

export const TUTORIAL_STEPS = [
  Step1Import,
  Step2Add,
  Step3Invite,
  Step4Code,
  Step5Finish,
] as Array<ITableTutorialStepProps>;

export interface ITableTutorialStepProps {
  onNext: () => void;
  isFinal: boolean;

  id: string;
  title: React.ReactNode;
  description: React.ReactNode;
  StepComponent: React.ComponentType<ITableTutorialStepComponentProps>;
  completeText?: React.ReactNode;
}

export interface ITableTutorialStepComponentProps {
  complete: boolean;
  setComplete: (complete: boolean) => void;
}
