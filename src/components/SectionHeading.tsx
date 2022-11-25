import { forwardRef } from "react";
import { camelCase } from "lodash-es";
import { HashLink } from "react-router-hash-link";

import { Stack, StackProps, Typography, IconButton } from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";

import { TOP_BAR_HEIGHT } from "@src/layouts/Navigation/TopBar";

export interface ISectionHeadingProps extends Omit<StackProps, "children"> {
  children: string;
}

export const SectionHeading = forwardRef(function SectionHeading_(
  { children, sx, ...props }: ISectionHeadingProps,
  ref
) {
  const sectionLink = camelCase(children);

  return (
    <Stack
      ref={ref}
      direction="row"
      alignItems="flex-end"
      id={sectionLink}
      {...props}
      sx={{
        pb: 0.5,
        cursor: "default",
        ...sx,

        position: "relative",
        zIndex: 1,
        "&:hover .sectionHeadingLink, &:active .sectionHeadingLink": {
          opacity: 1,
        },

        scrollMarginTop: (theme) => theme.spacing(TOP_BAR_HEIGHT / 8 + 3.5),
        scrollBehavior: "smooth",
      }}
    >
      <Typography variant="subtitle1" component="h2">
        {children}
      </Typography>
      <IconButton
        component={HashLink}
        to={`#${sectionLink}`}
        smooth
        size="small"
        className="sectionHeadingLink"
        sx={{
          my: -0.5,
          ml: 1,

          opacity: 0,
          transition: (theme) =>
            theme.transitions.create("opacity", {
              duration: theme.transitions.duration.short,
            }),

          "&:focus": { opacity: 1 },
        }}
      >
        <LinkIcon />
      </IconButton>
    </Stack>
  );
});

export default SectionHeading;
