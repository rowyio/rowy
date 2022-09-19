import seedrandom from "seedrandom";
import { colord } from "colord";

import { useTheme, Avatar, AvatarProps } from "@mui/material";
import { spreadSx } from "@src/utils/ui";

// https://www.stefanjudis.com/snippets/how-to-detect-emojis-in-javascript-strings/
const emojiRegex = /\p{Emoji}/u;

export const EMOJI_AVATAR_L_LIGHT = 90;
export const EMOJI_AVATAR_L_DARK = 30;
export const EMOJI_AVATAR_C_LIGHT = 15;
export const EMOJI_AVATAR_C_DARK = 20;

export interface IEmojiAvatarProps extends Partial<AvatarProps> {
  /** CSS color string or a number (as a string). If number, used as hue */
  bgColor?: string;
  emoji?: string;
  fallback: string;
  uid?: string;
  size?: number;
}

export default function EmojiAvatar({
  bgColor: bgColorProp,
  emoji,
  fallback,
  uid,
  children,
  size = 40,
  ...props
}: IEmojiAvatarProps) {
  const theme = useTheme();
  const darkMode = theme.palette.mode === "dark";

  let bgcolor: string;
  if (bgColorProp && !Number.isNaN(Number(bgColorProp))) {
    bgcolor = colord({
      l: darkMode ? EMOJI_AVATAR_L_DARK : EMOJI_AVATAR_L_LIGHT,
      c: darkMode ? EMOJI_AVATAR_C_DARK : EMOJI_AVATAR_C_LIGHT,
      h: Number(bgColorProp),
    }).toHslString();
  } else if (bgColorProp) {
    bgcolor = bgColorProp;
  } else {
    bgcolor = generateRandomColor(`${fallback}__${uid}`, darkMode);
  }

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
          fontSize: size * (emojiRegex.test(emoji || "") ? 0.67 : 0.45),
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
  const color = colord({
    l: darkMode ? EMOJI_AVATAR_L_DARK : EMOJI_AVATAR_L_LIGHT,
    c: darkMode ? EMOJI_AVATAR_C_DARK : EMOJI_AVATAR_C_LIGHT,
    h: rng() * 360,
  });
  return color.toHslString();
};
