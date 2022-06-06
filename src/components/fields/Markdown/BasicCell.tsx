import { IBasicCellProps } from "@src/components/fields/types";

import { useTheme } from "@mui/material";

import MDEditor from "@uiw/react-md-editor";

export default function Code({ value }: IBasicCellProps) {
  const theme = useTheme();
  return (
    <div className="container">
      <MDEditor.Markdown source={value} />
    </div>
  );
}
