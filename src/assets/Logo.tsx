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

      <path
        d="M58 3l4 9 4-9h2l-7 16h-2l2-4.5L56 3h2zm-26-.25a6.25 6.25 0 110 12.5 6.25 6.25 0 010-12.5zM26 3v2h-4v10h-2V3h6zm14 0l3 9 3-9h2l3 9 3-9h2l-4 12h-2l-3-9-3 9h-2L38 3h2zm-8 1.75a4.25 4.25 0 100 8.5 4.25 4.25 0 000-8.5z"
        fill={theme.palette.text.primary}
      />
      <path
        d="M13 0a3 3 0 010 6l-2-.001V6H6v7a3 3 0 01-6 0V3a3 3 0 015.501-1.657A2.989 2.989 0 018 0h5zM5 11H1v2a2 2 0 001.85 1.995L3 15a2 2 0 001.995-1.85L5 13v-2zm0-5H1v4h4V6zM3 1a2 2 0 00-1.995 1.85L1 3v2h4V3a2 2 0 00-1.85-1.995L3 1zm8.001 0v4H13a2 2 0 001.995-1.85L15 3a2 2 0 00-1.85-1.995L13 1h-1.999zM10 1H8a2 2 0 00-1.995 1.85L6 3v2h4V1z"
        fill={theme.palette.primary.main}
      />
    </svg>
  );
}
