import ReactMarkdown from "react-markdown";
import type { ReactMarkdownOptions } from "react-markdown/lib/react-markdown";
import remarkGfm from "remark-gfm";

import { Typography, Link } from "@mui/material";

const remarkPlugins = [remarkGfm];
const components: ReactMarkdownOptions["components"] = {
  a: (props) => <Link color="inherit" {...props} />,
  p: Typography,
  // eslint-disable-next-line jsx-a11y/alt-text
  img: (props) => (
    <img style={{ maxWidth: "100%", borderRadius: 4 }} alt="" {...props} />
  ),
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
      allowedElements={
        restrictionPreset ? restrictionPresets[restrictionPreset] : undefined
      }
      unwrapDisallowed
      linkTarget="_blank"
      remarkPlugins={remarkPlugins}
      components={{ ...components, ...props.components }}
    />
  );
}
