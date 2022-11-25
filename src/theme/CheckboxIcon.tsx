import { Box } from "@mui/material";
import { toRem } from "./typography";

export default function CheckboxIcon() {
  return (
    <Box
      component="span"
      sx={{
        width: toRem(18),
        height: toRem(18),
        margin: toRem((24 - 18) / 2),
        borderRadius: 1,
        display: "flex",

        position: "relative",

        bgcolor: "action.input",
        border: "1px solid",
        borderColor: "text.disabled",
        color: "primary.main",

        transition: (theme) =>
          theme.transitions.create(["background-color", "border-color"], {
            easing: theme.transitions.easing.easeIn,
            duration: theme.transitions.duration.shortest,
            delay: theme.transitions.duration.shortest,
          }),

        "& svg": {
          position: "absolute",
          width: toRem(18),
          height: toRem(18),
          top: -1,
          left: -1,
          color: "inherit",
        },
        "& .tick": {
          stroke: (theme) => theme.palette.primary.contrastText,
          strokeDasharray: 18,
          strokeDashoffset: 18,
          transition: (theme) =>
            theme.transitions.create(["stroke-dashoffset"], {
              easing: theme.transitions.easing.easeIn,
              duration: theme.transitions.duration.shortest,
            }),

          boxShadow: 1,
        },

        ".Mui-checked &, [aria-selected='true'] &": {
          backgroundColor: "currentColor",
          borderColor: "currentColor",

          transition: (theme) =>
            theme.transitions.create(["background-color", "border-color"], {
              easing: theme.transitions.easing.easeOut,
              duration: theme.transitions.duration.shortest,
            }),

          "& .tick": {
            strokeDashoffset: 0,
            transition: (theme) =>
              theme.transitions.create(["stroke-dashoffset"], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.shortest,
                delay: theme.transitions.duration.shortest,
              }),
          },
        },
      }}
      className="checkbox-icon"
    >
      <svg viewBox="0 0 18 18">
        <polyline
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points="2.705 8.29 7 12.585 15.295 4.29"
          fill="none"
          className="tick"
        />
      </svg>
    </Box>
  );
}
