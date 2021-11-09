import { styled, ListSubheader } from "@mui/material";

export const CloudLogSubheader = styled((props) => (
  <ListSubheader disableGutters disableSticky={false} {...props} />
))(({ theme }) => ({
  marginTop: theme.spacing(2),
  ...theme.typography.subtitle2,
  padding: theme.spacing((32 - 20) / 2 / 8, 1.5),

  "& code": { fontSize: "90%" },

  ".MuiPaper-elevation24 &": {
    backgroundImage:
      "linear-gradient(rgba(255, 255, 255, 0.16), rgba(255, 255, 255, 0.16))",
  },
}));

export default CloudLogSubheader;
