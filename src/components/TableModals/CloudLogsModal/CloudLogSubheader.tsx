import { styled, ListSubheader, ListSubheaderProps } from "@mui/material";

export const CloudLogSubheader = styled((props: ListSubheaderProps) => (
  <ListSubheader disableGutters disableSticky={false} {...props} />
))(({ theme }) => ({
  zIndex: 2,

  "&:not(:first-child)": { marginTop: theme.spacing(2) },
  ...(theme.typography.subtitle2 as any),
  padding: theme.spacing((32 - 20) / 2 / 8, 1.5),
  lineHeight: "20px",

  "& code": { fontSize: "90%" },

  ".MuiPaper-elevation24 &": {
    backgroundImage:
      "linear-gradient(rgba(255, 255, 255, 0.16), rgba(255, 255, 255, 0.16))",
  },
}));

export default CloudLogSubheader;
