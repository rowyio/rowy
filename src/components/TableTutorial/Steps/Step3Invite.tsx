import { ITableTutorialStepComponentProps } from ".";

import { useTheme, Link } from "@mui/material";
import InlineOpenInNewIcon from "@src/components/InlineOpenInNewIcon";

import { WIKI_LINKS } from "@src/constants/externalLinks";
import inviteUsersLight from "@src/assets/tutorial/invite-users-light.gif";
import inviteUsersDark from "@src/assets/tutorial/invite-users-dark.gif";

export const Step3Invite = {
  id: "invite",
  title: "Collaborate with your team to manage your data in realtime.",
  description: (
    <>
      Rowy allows you to invite your team members with granular, role-based
      access controls.{" "}
      <Link
        href={WIKI_LINKS.setupRoles}
        target="_blank"
        rel="noopener noreferrer"
      >
        Read the docs
        <InlineOpenInNewIcon />
      </Link>
    </>
  ),
  StepComponent,
};

export default Step3Invite;

function StepComponent({ setComplete }: ITableTutorialStepComponentProps) {
  setComplete(true);
  const theme = useTheme();

  return (
    <img
      src={theme.palette.mode === "dark" ? inviteUsersDark : inviteUsersLight}
      alt="Animation of a Rowy table with three cursors: admin, editor, and viewer."
      width={600}
      height={200}
    />
  );
}
