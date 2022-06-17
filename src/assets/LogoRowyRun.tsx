import { SVGProps } from "react";
import { useTheme } from "@mui/material";

export interface ILogoRowyRunProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

export default function LogoRowyRun({
  size = 1.5,
  ...props
}: ILogoRowyRunProps) {
  const theme = useTheme();

  return (
    <svg
      width={Math.round(108 * size)}
      height={Math.round(26 * size)}
      viewBox="0 0 108 26"
      xmlns="http://www.w3.org/2000/svg"
      aria-labelledby="rowy-run-logo-title"
      role="img"
      {...props}
    >
      <title id="rowy-run-logo-title">Rowy Run</title>

      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M32 7.75a6.25 6.25 0 1 1 0 12.5 6.25 6.25 0 0 1 0-12.5Zm0 2a4.25 4.25 0 1 0 0 8.5 4.25 4.25 0 0 0 0-8.5ZM20 20V8h6v2h-4v10h-2Zm24 0 3-9 3 9h2l4-12 5 11.5-2 4.5h2l7-16h-2l-4 9-4-9h-4l-3 9-3-9h-2l-3 9-3-9h-2l4 12h2Z"
        fill={theme.palette.text.primary}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 8v10a3 3 0 1 0 6 0v-7h7a3 3 0 1 0 0-6H8a2.997 2.997 0 0 0-2.5 1.341A3 3 0 0 0 0 8Zm10-2H8a2 2 0 0 0-1.995 1.85L6 8v2h4V6Zm-5 4V8a2 2 0 0 0-1.85-1.995L3 6a2 2 0 0 0-1.995 1.85L1 8v2h4Zm0 1H1v4h4v-4Zm-4 5v2a2 2 0 0 0 1.85 1.994L3 20a2 2 0 0 0 1.995-1.85L5 18v-2H1ZM11.001 6H13l.15.005A2 2 0 0 1 15 8l-.005.15A2 2 0 0 1 13 10h-1.999V6Z"
        fill={theme.palette.primary.main}
      />
      <path
        d="M73.25 20h1.825v-8.375c.775-1.475 2.125-2.35 3.2-2.35.425 0 .925.075 1.35.225V7.775c-.275-.1-.725-.175-1.225-.175-1.25 0-2.65.85-3.325 2.175V7.85H73.25V20Zm17.65 0h1.85V7.85h-1.824L90.9 16.3c-.75 1.35-2.25 2.175-3.875 2.175-2.125 0-3.55-1.525-3.55-3.875V7.85H81.65v7c0 3.275 2 5.4 5 5.4 1.775 0 3.45-.825 4.25-2.175V20Zm7.007-12.15h-1.825V20h1.825v-8.475c.75-1.325 2.275-2.15 3.875-2.15 2.125 0 3.55 1.525 3.55 3.875V20h1.825v-7c0-3.275-2-5.4-5-5.4-1.775 0-3.45.825-4.25 2.15v-1.9Z"
        fill={theme.palette.primary.main}
      />
    </svg>
  );
}
