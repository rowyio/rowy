import { useTheme } from "@material-ui/core";

export default function Logo() {
  const theme = useTheme();

  return (
    <svg
      width="102"
      height="33"
      viewBox="0 -3 68 22"
      xmlns="http://www.w3.org/2000/svg"
      aria-labelledby="rowy-logo-title"
      role="img"
    >
      <title id="rowy-logo-title">rowy</title>
      <defs>
        <linearGradient x1="83.349%" y1="50%" x2="0%" y2="50%" id="a">
          <stop stop-color="#F0A" offset="0%" />
          <stop stop-color="#FA0" offset="100%" />
        </linearGradient>
        <linearGradient x1="50%" y1="16.276%" x2="50%" y2="100%" id="b">
          <stop stop-color="#4200FF" offset="0%" />
          <stop stop-color="#F0A" offset="100%" />
        </linearGradient>
        <linearGradient x1="83.052%" y1="50%" x2="0%" y2="50%" id="c">
          <stop stop-color="#0AF" offset="0%" />
          <stop stop-color="#0FA" offset="100%" />
        </linearGradient>
        <linearGradient x1="100%" y1="50%" x2="16.614%" y2="50%" id="d">
          <stop stop-color="#0AF" offset="0%" />
          <stop stop-color="#4200FF" offset="100%" />
        </linearGradient>
      </defs>
      <g fill="none" fill-rule="evenodd">
        <path
          d="M58 3l4 9 4-9h2l-7 16h-2l2-4.5L56 3h2zm-26-.25a6.25 6.25 0 110 12.5 6.25 6.25 0 010-12.5zM26 3v2h-4v10h-2V3h6zm14 0l3 9 3-9h2l3 9 3-9h2l-4 12h-2l-3-9-3 9h-2L38 3h2zm-8 1.75a4.25 4.25 0 100 8.5 4.25 4.25 0 000-8.5z"
          fill={theme.palette.text.primary}
        />
        <g fill-rule="nonzero">
          <path
            d="M6 10v6H3a3 3 0 010-6h3zm-1 5v-4H3a2 2 0 00-1.995 1.85L1 13a2 2 0 001.85 1.995L3 15h2z"
            fill={
              theme.palette.mode === "light"
                ? "url(#a)"
                : theme.palette.text.primary
            }
            transform="rotate(-90 3 13)"
          />
          <path
            d="M6 6H0V3a3 3 0 116 0v3zM1 5h4V3a2 2 0 00-1.85-1.995L3 1a2 2 0 00-1.995 1.85L1 3v2z"
            fill={
              theme.palette.mode === "light"
                ? "#4200FF"
                : theme.palette.text.primary
            }
          />
          <path
            d="M6 5v6H0V5h6zM5 6H1v4h4V6z"
            fill={
              theme.palette.mode === "light"
                ? "url(#b)"
                : theme.palette.text.primary
            }
          />
          <path
            d="M16 0v6h-3a3 3 0 010-6h3zm-1.001 5V1H13a2 2 0 00-1.995 1.85L11 3a2 2 0 001.85 1.995L13 5h1.999z"
            fill={
              theme.palette.mode === "light"
                ? "url(#c)"
                : theme.palette.text.primary
            }
            transform="rotate(-180 13 3)"
          />
          <path
            d="M11 0v6H5V3a3 3 0 013-3h3zm-1 1H8a2 2 0 00-1.995 1.85L6 3v2h4V1z"
            fill={
              theme.palette.mode === "light"
                ? "url(#d)"
                : theme.palette.text.primary
            }
          />
        </g>
      </g>
    </svg>
  );
}
