import { use100vh } from "react-div-100vh";

import { GlobalStyles, Box, BoxProps } from "@mui/material";
import { alpha } from "@mui/material/styles";

import bgPattern from "@src/assets/bg-pattern.svg";
import bgPatternDark from "@src/assets/bg-pattern-dark.svg";

export default function BrandedBackground() {
  return (
    <GlobalStyles
      styles={(theme) => `
          body {
            background-size: 100%;
            background-image: ${
              // prettier-ignore
              [
                `radial-gradient(circle   at  85% 100%, ${theme.palette.background.paper} 20%, ${alpha(theme.palette.background.paper, 0)})`,
                `radial-gradient(80%  80% at  15% 100%, ${alpha("#FA0", 0.1)} 25%, ${alpha("#F0A", 0.1)} 50%, ${alpha("#F0A", 0)} 100%)`,
                `linear-gradient(to top, ${alpha(theme.palette.background.paper, 1)}, ${alpha(theme.palette.background.paper, 0)})`,
                `radial-gradient(60% 180% at 100%  15%, ${alpha("#0FA", 0.3)} 25%, ${alpha("#0AF", 0.2)} 50%, ${alpha("#0AF", 0)} 100%)`,
                `linear-gradient(${alpha(theme.palette.primary.main, 0.2)}, ${alpha(theme.palette.primary.main, 0.2)})`,
              ].join(", ")
            };
          }
          body::before {
            content: "";
            display: block;
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            z-index: -1;

            background-image: url('${
              theme.palette.mode === "dark" ? bgPatternDark : bgPattern
            }');
            background-size: ${(480 * 10) / 14}px;
            mix-blend-mode: overlay;
          }

          #root#root {
            background-color: transparent;
          }
        `}
    />
  );
}

export function Wrapper(props: BoxProps) {
  const fullScreenHeight = use100vh() ?? 0;

  return (
    <Box
      {...props}
      sx={{
        display: "grid",
        placeItems: "center",
        alignContent: "center",
        gap: (theme) => ({ xs: theme.spacing(2), sm: theme.spacing(3) }),
        gridAutoRows: "max-content",
        minHeight: fullScreenHeight > 0 ? `${fullScreenHeight}px` : "100vh",

        pt: (theme) => `max(env(safe-area-inset-top), ${theme.spacing(1)})`,
        pb: (theme) => `max(env(safe-area-inset-bottom), ${theme.spacing(1)})`,
        pl: (theme) => `max(env(safe-area-inset-left), ${theme.spacing(1)})`,
        pr: (theme) => `max(env(safe-area-inset-right), ${theme.spacing(1)})`,
        ...props.sx,
      }}
    />
  );
}
