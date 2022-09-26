import {
  useScrollTrigger,
  Paper,
  TextField,
  FilledTextFieldProps,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import SlideTransition from "@src/components/Modal/SlideTransition";
import { TOP_BAR_HEIGHT } from "@src/layouts/Navigation/TopBar";

export interface IFloatingSearchProps extends Partial<FilledTextFieldProps> {
  label: string;
  paperSx?: FilledTextFieldProps["sx"];
}

export default function FloatingSearch({
  label,
  paperSx,
  ...props
}: IFloatingSearchProps) {
  const dockedTransition = useScrollTrigger({
    disableHysteresis: true,
    threshold: 4,
  });
  const docked = useScrollTrigger({
    disableHysteresis: true,
    threshold: TOP_BAR_HEIGHT,
  });

  return (
    <SlideTransition in timeout={50}>
      <Paper
        elevation={dockedTransition ? 4 : 1}
        sx={{
          position: "sticky",
          top: (theme) => theme.spacing(0.5),
          zIndex: "appBar",
          height: 48,
          maxWidth: (theme) => theme.breakpoints.values.sm - 48,
          width: "100%",
          mx: "auto",

          transition: (theme) =>
            theme.transitions.create([
              "box-shadow",
              "transform",
              "opacity",
              "width",
            ]) + " !important",
          transitionTimingFunction: (
            theme
          ) => `${theme.transitions.easing.easeInOut},
                cubic-bezier(0.1, 0.8, 0.1, 1),
                cubic-bezier(0.1, 0.8, 0.1, 1) !important`,

          ...paperSx,

          ...(dockedTransition
            ? {
                width: `calc(100vw - ${
                  (48 + 8) * 2
                }px - env(safe-area-inset-left) - env(safe-area-inset-right))`,
              }
            : {}),

          ...(docked ? { boxShadow: "none" } : {}),
        }}
      >
        <TextField
          label={label}
          placeholder={label}
          hiddenLabel
          fullWidth
          type="search"
          id="user-management-search"
          size="medium"
          autoFocus
          InputProps={{
            startAdornment: (
              <InputAdornment
                position="start"
                sx={{ px: 0.5, pointerEvents: "none" }}
              >
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiInputLabel-root": {
              height: "0px",
              m: 0,
              p: 0,
              pointerEvents: "none",
              opacity: 0,
            },
            "& .MuiFilledInput-root": {
              borderRadius: 2,

              ...(docked
                ? {}
                : {
                    boxShadow: (theme) =>
                      `0 -1px 0 0 ${theme.palette.text.disabled} inset`,
                    "&:hover": {
                      boxShadow: (theme) =>
                        `0 -1px 0 0 ${theme.palette.text.primary} inset`,
                    },
                    "&.Mui-focused, &.Mui-focused:hover": {
                      boxShadow: (theme) =>
                        `0 -2px 0 0 ${theme.palette.primary.main} inset`,
                    },
                  }),

              "&::after": {
                width: (theme) =>
                  `calc(100% - ${
                    (theme.shape.borderRadius as number) * 2 * 2
                  }px)`,
                left: (theme) => (theme.shape.borderRadius as number) * 2,
              },

              "&.Mui-disabled": {
                bgcolor: "transparent",
                boxShadow: "none",
                "& .MuiInputAdornment-root": { color: "text.disabled" },
              },
            },
          }}
          {...props}
        />
      </Paper>
    </SlideTransition>
  );
}
