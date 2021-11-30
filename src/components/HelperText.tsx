import { useTheme } from "@mui/material";

export interface IHelperTextProps {
  children: React.ReactNode;
}

export default function HelperText(props: IHelperTextProps) {
  const theme = useTheme();

  return (
    <div
      {...props}
      style={{
        marginTop: theme.spacing(-3),
        padding: theme.spacing(0, 1.5),
        ...(theme.typography.body2 as any),
        color: theme.palette.text.secondary,
      }}
    />
  );
}
