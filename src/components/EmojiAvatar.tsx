import seedrandom from "seedrandom";
import { colord } from "colord";

import { useTheme, Avatar, AvatarProps } from "@mui/material";
import { spreadSx } from "@src/utils/ui";

export interface IEmojiAvatarProps extends Partial<AvatarProps> {
  bgColor?: string;
  emoji?: string;
  fallback: string;
  size?: number;
}

export default function EmojiAvatar({
  bgColor,
  emoji,
  fallback,
  children,
  size = 40,
  ...props
}: IEmojiAvatarProps) {
  const theme = useTheme();
  const darkMode = theme.palette.mode === "dark";

  const bgcolor = bgColor || generateRandomColor(fallback, darkMode);
  const bgcolorLch = colord(bgcolor).toLch();
  const textColor = colord({
    l:
      bgcolorLch.l > 50
        ? Math.max(bgcolorLch.l - 50, 0)
        : Math.min(bgcolorLch.l + 50, 100),
    c: 30,
    h: bgcolorLch.h,
  }).toHslString();

  return (
    <Avatar
      {...props}
      sx={[
        {
          bgcolor,
          color: textColor,
          width: size,
          height: size,
          fontSize: size * 0.45,
        },
        props.variant === "rounded" && { borderRadius: size / 40 },
        ...spreadSx(props.sx),
      ]}
    >
      {children ||
        emoji ||
        fallback
          .split(" ")
          .slice(0, 2)
          .map((s) => s.slice(0, 1))
          .join("")}
    </Avatar>
  );
}

const generateRandomColor = (seed: string, darkMode: boolean) => {
  const rng = seedrandom(seed);
  const color = colord({ l: darkMode ? 30 : 90, c: 15, h: rng() * 360 });
  return color.toHslString();
};
