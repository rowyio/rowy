import { SVGProps } from "react";
import { useTheme } from "@mui/material";

export interface ILogoProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

export default function Logo({ size = 1.5, ...props }: ILogoProps) {
  const theme = useTheme();

  return (
    <svg
      width={Math.round(68 * size)}
      height={Math.round(21 * size)}
      viewBox="0 -1.5 68 21"
      xmlns="http://www.w3.org/2000/svg"
      aria-labelledby="rowy-logo-title"
      role="img"
      {...props}
    >
      <title id="rowy-logo-title">Rowy</title>

      <defs>
        <linearGradient x1="83.349%" y1="50%" x2="0%" y2="50%" id="rowy-b">
          <stop stopColor="#F0A" offset="0%" />
          <stop stopColor="#FA0" offset="100%" />
        </linearGradient>
        <linearGradient x1="50%" y1="16.276%" x2="50%" y2="100%" id="rowy-c">
          <stop stopColor="#4200FF" offset="0%" />
          <stop stopColor="#F0A" offset="100%" />
        </linearGradient>
        <linearGradient x1="83.052%" y1="50%" x2="0%" y2="50%" id="rowy-d">
          <stop stopColor="#0AF" offset="0%" />
          <stop stopColor="#0FA" offset="100%" />
        </linearGradient>
        <linearGradient x1="100%" y1="50%" x2="16.614%" y2="50%" id="rowy-e">
          <stop stopColor="#0AF" offset="0%" />
          <stop stopColor="#4200FF" offset="100%" />
        </linearGradient>
      </defs>

      <path
        d="M6 10v6H3a3 3 0 010-6h3zm-1 5v-4H3a2 2 0 00-1.995 1.85L1 13a2 2 0 001.85 1.995L3 15h2z"
        fill="url(#rowy-b)"
        transform="rotate(-90 3 13)"
      />
      <path
        d="M6 6H0V3a3 3 0 116 0v3zM1 5h4V3a2 2 0 00-1.85-1.995L3 1a2 2 0 00-1.995 1.85L1 3v2z"
        fill="#4200FF"
      />
      <path d="M6 5v6H0V5h6zM5 6H1v4h4V6z" fill="url(#rowy-c)" />
      <path
        d="M16 0v6h-3a3 3 0 010-6h3zm-1.001 5V1H13a2 2 0 00-1.995 1.85L11 3a2 2 0 001.85 1.995L13 5h1.999z"
        fill="url(#rowy-d)"
        transform="rotate(-180 13 3)"
      />
      <path
        d="M11 0v6H5V3a3 3 0 013-3h3zm-1 1H8a2 2 0 00-1.995 1.85L6 3v2h4V1z"
        fill="url(#rowy-e)"
      />

      <path
        d="M58 3l4 9 4-9h2l-7 16h-2l2-4.5L56 3h2zm-26-.25a6.25 6.25 0 110 12.5 6.25 6.25 0 010-12.5zM26 3v2h-4v10h-2V3h6zm14 0l3 9 3-9h2l3 9 3-9h2l-4 12h-2l-3-9-3 9h-2L38 3h2zm-8 1.75a4.25 4.25 0 100 8.5 4.25 4.25 0 000-8.5z"
        fill={theme.palette.text.primary}
      />
    </svg>
  );
}
