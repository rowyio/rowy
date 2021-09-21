import Helmet from "react-helmet";
import { use100vh } from "react-div-100vh";

import { useTheme, alpha } from "@mui/material/styles";

import bgPattern from "assets/bg-pattern.svg";
import bgPatternDark from "assets/bg-pattern-dark.svg";

export default function BrandedBackground() {
  const theme = useTheme();
  const fullScreenHeight = use100vh() ?? 0;

  return (
    <Helmet>
      <style type="text/css">
        {`
          body {
            background-blend-mode: ${
              // prettier-ignore
              [
                "normal",
                "normal",
                "normal",

                "overlay",

                "normal",
                "normal",
              ].join(", ")
            };
            background-size: ${
              // prettier-ignore
              [
                "100%",
                "100%",
                "100%",

                `${480 * 10 / 14}px`,

                "100%",
                "100%",
              ].join(", ")
            };
            background-image: ${
              // prettier-ignore
              [
                `radial-gradient(circle   at  85% 100%, ${theme.palette.background.paper} 20%, ${alpha(theme.palette.background.paper, 0)})`,
                `radial-gradient(80%  80% at  15% 100%, ${alpha("#FA0", 0.1)} 25%, ${alpha("#F0A", 0.1)} 50%, ${alpha("#F0A", 0)} 100%)`,
                `linear-gradient(to top, ${alpha(theme.palette.background.paper, 1)}, ${alpha(theme.palette.background.paper, 0)})`,

                `url('${theme.palette.mode==="dark" ? bgPatternDark : bgPattern}')`,

                `radial-gradient(60% 180% at 100%  15%, ${alpha("#0FA", 0.3)} 25%, ${alpha("#0AF", 0.2)} 50%, ${alpha("#0AF", 0)} 100%)`,
                `linear-gradient(${alpha(theme.palette.primary.main, 0.2)}, ${alpha(theme.palette.primary.main, 0.2)})`,
              ].join(", ")
            };
          }

          #root {
            cursor: default;
          }
          
          .wrapper {
            display: grid;
            place-items: center;
            align-content: center;
            gap: ${theme.spacing(3)};
            grid-auto-rows: max-content;

            ${["top", "right", "bottom", "left"]
              .map(
                (side) =>
                  `padding-${side}: max(env(safe-area-inset-${side}), ${theme.spacing(
                    1
                  )});`
              )
              .join("\n")}
            
            min-height: ${
              fullScreenHeight > 0 ? `${fullScreenHeight}px` : "100vh"
            };
          }
          `}
      </style>
    </Helmet>
  );
}
