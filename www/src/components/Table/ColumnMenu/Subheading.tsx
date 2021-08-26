import { useTheme, Typography, TypographyProps } from "@material-ui/core";

export default function Subheading(props: TypographyProps<"h2">) {
  const theme = useTheme();

  return (
    <Typography
      variant="overline"
      display="block"
      gutterBottom
      component="h3"
      {...props}
      style={{
        color: theme.palette.text.disabled,
        ...props.style,
      }}
    />
  );
}
