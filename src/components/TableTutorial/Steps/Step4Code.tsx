import { ITableTutorialStepComponentProps } from ".";

import { useTheme, Link } from "@mui/material";
import InlineOpenInNewIcon from "@src/components/InlineOpenInNewIcon";

import { WIKI_LINKS } from "@src/constants/externalLinks";
import derivativeLight from "@src/assets/tutorial/derivative-light.gif";
import derivativeDark from "@src/assets/tutorial/derivative-dark.gif";

export const Step4Code = {
  id: "code",
  title: "Let’s learn how to unlock the true powers of Rowy.",
  description: (
    <>
      You can write code in JavaScript to build any data logic with Derivative
      columns, or build CRUD tasks with Extensions. And you can use any API or
      NPM package.{" "}
      <Link
        href={WIKI_LINKS.fieldTypesDerivative}
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn more
        <InlineOpenInNewIcon />
      </Link>
    </>
  ),
  StepComponent,
};

export default Step4Code;

function StepComponent({ setComplete }: ITableTutorialStepComponentProps) {
  setComplete(true);
  const theme = useTheme();

  return (
    <img
      src={theme.palette.mode === "dark" ? derivativeDark : derivativeLight}
      alt="Animation of a user entering two values, and the result of the executed Derivative code being displayed."
      width={600}
      height={200}
    />
  );
}
