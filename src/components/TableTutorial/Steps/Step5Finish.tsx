import { ITableTutorialStepComponentProps } from ".";
import { Typography, Link } from "@mui/material";
import { EXTERNAL_LINKS } from "@src/constants/externalLinks";

export const Step5Finish = {
  id: "finish",
  title: "Congrats, you’re ready to start building your own table! 🎉",
  description: "",
  StepComponent,
};

export default Step5Finish;

function StepComponent({ setComplete }: ITableTutorialStepComponentProps) {
  setComplete(true);

  return (
    <Typography
      component="ul"
      variant="body1"
      sx={{ margin: 0, paddingLeft: "1em", "& > * + *": { mt: 1 } }}
    >
      <li>
        Play around with the demo tables in our live community{" "}
        <Link
          href={EXTERNAL_LINKS.playground}
          target="_blank"
          rel="noopener noreferrer"
        >
          playground
        </Link>{" "}
        to learn what you can do with Rowy
      </li>
      <li>
        Check out and deploy our{" "}
        <Link
          href={EXTERNAL_LINKS.templates}
          target="_blank"
          rel="noopener noreferrer"
        >
          templates
        </Link>{" "}
        to explore how Rowy can improve your project
      </li>
      <li>
        Connect with us on{" "}
        <Link
          href={EXTERNAL_LINKS.discord}
          target="_blank"
          rel="noopener noreferrer"
        >
          Discord
        </Link>{" "}
        and{" "}
        <Link
          href={EXTERNAL_LINKS.gitHub}
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </Link>{" "}
        and ask us how Rowy can help with your specific use case
      </li>
    </Typography>
  );
}
