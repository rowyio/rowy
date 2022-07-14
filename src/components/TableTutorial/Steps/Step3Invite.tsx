import { ITableTutorialStepComponentProps } from ".";

export const Step3Invite = {
  id: "invite",
  title: "Let’s create a simple product pricing table",
  description:
    "Rowy allows you to invite your team members with granular, role-based access controls.",
  StepComponent,
};

export default Step3Invite;

function StepComponent({ setComplete }: ITableTutorialStepComponentProps) {
  setComplete(true);

  return <>TODO:</>;
}
