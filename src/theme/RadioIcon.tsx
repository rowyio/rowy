import { Box } from "@mui/material";
import { toRem } from "./typography";

export default function RadioIcon() {
  return (
    <Box
      component="span"
      sx={{
        width: toRem(20),
        height: toRem(20),
        margin: toRem((24 - 20) / 2),
        borderRadius: "50%",
        display: "flex",

        backgroundColor: "transparent",
        border: "1px solid",
        borderColor: "text.disabled",
        color: "primary.main",

        transition: (theme) =>
          theme.transitions.create(["background-color", "border-color"], {
            easing: theme.transitions.easing.easeIn,
            duration: theme.transitions.duration.shortest,
          }),

        "&::before": {
          content: '""',
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          display: "block",

          bgcolor: "action.input",
          transition: (theme) =>
            theme.transitions.create(["transform", "background-color"], {
              easing: theme.transitions.easing.easeIn,
              duration: theme.transitions.duration.shortest,
            }),
        },

        ".Mui-checked &, [aria-selected='true'] &": {
          backgroundColor: "currentColor",
          borderColor: "currentColor",

          transition: (theme) =>
            theme.transitions.create(["background-color", "border-color"], {
              easing: theme.transitions.easing.easeOut,
              duration: theme.transitions.duration.shortest,
            }),

          "&::before": {
            bgcolor: "primary.contrastText",
            boxShadow: 1,
            transform: `scale(${12 / 20})`,

            transition: (theme) =>
              theme.transitions.create(["transform", "background-color"], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.shortest,
              }),
          },
        },
      }}
      className="radio-icon"
    />
  );
}
