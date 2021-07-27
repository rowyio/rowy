import DOMPurify from "dompurify";
import clsx from "clsx";

import { makeStyles, createStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      maxWidth: "33em",
      ...theme.typography.body2,

      "& * + *": {
        marginTop: "1em !important",
      },

      "& h1, & h2, & h3, & h4, & h5, & h6": {
        fontFamily: '"Europa", "Open Sans", sans-serif',
        margin: 0,
        lineHeight: 1.2,
        fontWeight: "bold",
      },
      "& p": {
        margin: 0,
        marginTop: "inherit",
      },

      "& a": {
        fontWeight: "bold",
        color: theme.palette.primary.main,
        textDecoration: "underline",

        "&:hover": { color: theme.palette.primary.dark },
      },

      "& ul, & ol": {
        margin: 0,
        paddingLeft: "1.5em",
      },
      "& li + li": {
        marginTop: "0.5em",
      },

      "& table": {
        borderCollapse: "collapse",
      },

      "& table th, & table td": {
        border: `1px solid ${theme.palette.divider}`,
        padding: "0.4rem",
      },
      "& figure": {
        display: "table",
        margin: "1rem auto",
      },
      "& figure figcaption": {
        color: "#999",
        display: "block",
        marginTop: "0.25rem",
        textAlign: "center",
      },
      "& hr": {
        borderColor: `1px solid ${theme.palette.divider}`,
        borderWidth: "1px 0 0 0",
      },
      "& code": {
        backgroundColor: "#e8e8e8",
        borderRadius: theme.shape.borderRadius,
        padding: "0.1rem 0.2rem",
        fontFamily: theme.typography.fontFamilyMono,
      },
      "& pre": {
        fontFamily: theme.typography.fontFamilyMono,
      },
      '& .mceContent-body:not([dir="rtl"]) blockquote': {
        borderLeft: `2px solid ${theme.palette.divider}`,
        marginLeft: "1.5rem",
        paddingLeft: "1rem",
      },
      '& .mceContent-body[dir="rtl"] blockquote': {
        borderRight: `2px solid ${theme.palette.divider}`,
        marginRight: "1.5rem",
        paddingRight: "1rem",
      },
    },
  })
);

export interface IRenderedHtmlProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  html: string;
}

export default function RenderedHtml({
  html,
  className,
  ...props
}: IRenderedHtmlProps) {
  const classes = useStyles();

  return (
    <div
      className={clsx(classes.root, className)}
      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }}
      {...props}
    />
  );
}
