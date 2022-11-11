import { IDisplayCellProps } from "@src/components/fields/types";

import { useTheme } from "@mui/material";

import MDEditor from "@uiw/react-md-editor";

export default function Markdown({ value, tabIndex }: IDisplayCellProps) {
  const theme = useTheme();

  if (!value || typeof value !== "string") return null;

  return (
    <div
      data-color-mode={theme.palette.mode}
      style={{ height: "100%", overflow: "hidden", whiteSpace: "normal" }}
      // Prevent user tabbing into any rendered links
      {...({ inert: tabIndex === -1 ? "inert" : undefined } as any)}
    >
      <MDEditor.Markdown source={value.slice(0, 240)} />
    </div>
  );
}
