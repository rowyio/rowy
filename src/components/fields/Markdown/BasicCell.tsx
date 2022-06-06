import { IBasicCellProps } from "@src/components/fields/types";

import { useTheme } from "@mui/material";

import MDEditor from "@uiw/react-md-editor";

export default function Code({ value }: IBasicCellProps) {
  const theme = useTheme();
  return (
    <div data-color-mode={theme.palette.mode}>
      <MDEditor.Markdown source={value} />
    </div>
  );
}
