import { ITableTutorialStepComponentProps } from ".";

export const Step4Code = {
  id: "code",
  title: "Let’s learn how to unlock the true powers of Rowy",
  description: "TODO:",
  StepComponent,
};

export default Step4Code;

function StepComponent({ setComplete }: ITableTutorialStepComponentProps) {
  setComplete(true);

  return <>TODO:</>;
}
