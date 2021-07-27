import clsx from "clsx";
import { makeStyles, createStyles, Chip, ChipProps } from "@material-ui/core";

export const VARIANTS = ["yes", "no", "maybe"];

const useStyles = makeStyles(
  createStyles({
    yes: {
      backgroundColor: "#58bc8a",
      color: "hsl(150, 100%, 11%)",
    },
    maybe: {
      backgroundColor: "#ffd666",
      color: "hsl(39, 100%, 14%)",
    },
    no: {
      backgroundColor: "#e67d73",
      color: "hsl(5, 100%, 13%)",
    },
  })
);

// TODO: Create a more generalised solution for this
export default function FormattedChip(props: ChipProps) {
  const classes = useStyles();

  const label =
    typeof props.label === "string" ? props.label.toLowerCase() : "";

  if (VARIANTS.includes(label)) {
    return (
      <Chip
        size="small"
        {...props}
        className={clsx(props.className, classes[label])}
      />
    );
  }

  return <Chip size="small" {...props} />;
}
