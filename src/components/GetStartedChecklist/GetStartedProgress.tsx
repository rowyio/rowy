import StepsProgress, {
  IStepsProgressProps,
} from "@src/components/StepsProgress";
import useGetStartedCompletion from "./useGetStartedCompletion";

export default function GetStartedProgress(
  props: Omit<IStepsProgressProps, "value" | "steps">
) {
  const [completedSteps, count] = useGetStartedCompletion();

  return (
    <StepsProgress
      {...props}
      value={count}
      steps={Object.keys(completedSteps).length}
    />
  );
}
