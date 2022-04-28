import { Paper, PaperProps } from "@mui/material";

import SectionHeading from "@src/components/SectionHeading";
import SlideTransition from "@src/components/Modal/SlideTransition";

export interface ISettingsSectionProps {
  children: React.ReactNode;
  title: string;
  paperSx?: PaperProps["sx"];
  transitionTimeout?: number;
}

export default function SettingsSection({
  children,
  title,
  paperSx,
  transitionTimeout = 100,
}: ISettingsSectionProps) {
  return (
    <section style={{ cursor: "default" }}>
      <SlideTransition in timeout={transitionTimeout}>
        <SectionHeading sx={{ mx: 1 }}>{title}</SectionHeading>
      </SlideTransition>

      <SlideTransition in timeout={transitionTimeout + 50}>
        <Paper
          sx={{
            p: { xs: 2, sm: 3 },

            "& > :not(style) + :not(style)": {
              m: 0,
              mt: { xs: 2, sm: 3 },
            },

            ...paperSx,
          }}
        >
          {children}
        </Paper>
      </SlideTransition>
    </section>
  );
}
