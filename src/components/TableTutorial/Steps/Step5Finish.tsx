import { ITableTutorialStepComponentProps } from ".";
import { useTheme, Grid, Typography, Link } from "@mui/material";
import { EXTERNAL_LINKS } from "@src/constants/externalLinks";

import playgroundLight from "@src/assets/tutorial/playground-light.svg";
import playgroundDark from "@src/assets/tutorial/playground-dark.svg";
import templatesLight from "@src/assets/tutorial/templates-light.svg";
import templatesDark from "@src/assets/tutorial/templates-dark.svg";
import communityLight from "@src/assets/tutorial/community-light.svg";
import communityDark from "@src/assets/tutorial/community-dark.svg";

export const Step5Finish = {
  id: "finish",
  title: "Congrats, you’re ready to start building your own table! 🎉",
  description: "",
  StepComponent,
};

export default Step5Finish;

function StepComponent({ setComplete }: ITableTutorialStepComponentProps) {
  setComplete(true);
  const theme = useTheme();

  return (
    <Grid
      container
      spacing={4}
      sx={{
        textAlign: "center",
        "& img": { mb: 1 },
        maxWidth: 840,
      }}
    >
      <Grid item xs={12} sm={6} md={4}>
        <img
          src={theme.palette.mode === "dark" ? playgroundDark : playgroundLight}
          alt="Puzzle pieces coming together"
          height={100}
        />

        <Typography>
          Play around with the demo tables in our live community{" "}
          <Link
            href={EXTERNAL_LINKS.playground}
            target="_blank"
            rel="noopener noreferrer"
          >
            playground
          </Link>{" "}
          to learn what you can do with Rowy.
        </Typography>
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <img
          src={theme.palette.mode === "dark" ? templatesDark : templatesLight}
          alt="Blocks coming together"
          height={100}
        />

        <Typography>
          Check out and deploy our{" "}
          <Link
            href={EXTERNAL_LINKS.templates}
            target="_blank"
            rel="noopener noreferrer"
          >
            templates
          </Link>{" "}
          to explore how Rowy can improve your project.
        </Typography>
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <img
          src={theme.palette.mode === "dark" ? communityDark : communityLight}
          alt="People coming together"
          height={100}
        />

        <Typography>
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
          and ask us how Rowy can help with your specific use case.
        </Typography>
      </Grid>
    </Grid>
  );
}
