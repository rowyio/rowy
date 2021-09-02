import { Typography, Paper } from "@material-ui/core";

export interface ISettingsSectionProps {
  children: React.ReactNode;
  title: string;
}

export default function SettingsSection({
  children,
  title,
}: ISettingsSectionProps) {
  return (
    <section style={{ cursor: "default" }}>
      <Typography
        variant="subtitle1"
        component="h2"
        sx={{ mx: 1, mb: 0.5 }}
        id={title}
      >
        {title}
      </Typography>
      <Paper
        sx={{
          p: { xs: 2, sm: 3 },

          "& > :not(style) + :not(style)": {
            m: 0,
            mt: { xs: 2, sm: 3 },
          },
        }}
      >
        {children}
      </Paper>
    </section>
  );
}
