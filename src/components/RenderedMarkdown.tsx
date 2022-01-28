import ReactMarkdown from "react-markdown";
import type { ReactMarkdownOptions } from "react-markdown/lib/react-markdown";
import remarkGfm from "remark-gfm";

import { Typography, Link } from "@mui/material";

const remarkPlugins = [remarkGfm];
const components = {
  a: (p) => <Link color="inherit" {...p} />,
  p: Typography,
};

const restrictionPresets = {
  singleLine: ["p", "em", "strong", "a", "code", "del"],
};

export interface IRenderedMarkdownProps extends ReactMarkdownOptions {
  restrictionPreset?: keyof typeof restrictionPresets;
}

export default function RenderedMarkdown({
  restrictionPreset,
  ...props
}: IRenderedMarkdownProps) {
  return (
    <ReactMarkdown
      {...props}
      allowedElements={restrictionPresets[restrictionPreset || ""]}
      unwrapDisallowed
      linkTarget="_blank"
      remarkPlugins={remarkPlugins}
      components={components}
    />
  );
}
