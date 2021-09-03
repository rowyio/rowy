import {
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Tooltip,
  IconButton,
} from "@material-ui/core";
import CopyIcon from "assets/icons/Copy";
import DeleteIcon from "@material-ui/icons/DeleteOutlined";

import MultiSelect from "@antlerengineering/multiselect";
import { User } from "pages/Settings/UserManagement";

export default function UserItem({
  id,
  user: { displayName, email, photoURL },
}: User) {
  return (
    <ListItem
      children={
        <>
          <ListItemAvatar>
            <Avatar src={photoURL}>SM</Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={displayName}
            secondary={email}
            primaryTypographyProps={{
              style: { userSelect: "all" },
            }}
            secondaryTypographyProps={{
              noWrap: true,
              style: { userSelect: "all" },
            }}
          />
        </>
      }
      secondaryAction={
        <>
          <MultiSelect
            label="Roles"
            value={["ADMIN"]}
            options={["ADMIN"]}
            onChange={console.log}
            TextFieldProps={{
              fullWidth: false,

              sx: {
                mr: 0.5,

                "& .MuiInputLabel-root": {
                  opacity: 0,
                  mt: -3,
                },

                "& .MuiFilledInput-root": {
                  boxShadow: 0,
                  "&::before": { content: "none" },

                  "&:hover, &.Mui-focused": { bgcolor: "action.hover" },
                },
                "& .MuiSelect-select.MuiFilledInput-input": {
                  typography: "button",
                  pl: 1,
                  pr: 3.5,
                },
                "& .MuiSelect-icon": {
                  right: 2,
                },
              },
            }}
          />

          <Tooltip title="Copy UID">
            <IconButton
              aria-label="Copy UID"
              onClick={() => navigator.clipboard.writeText(id)}
            >
              <CopyIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton aria-label="Delete" color="error">
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </>
      }
      sx={{
        pr: 1,

        "& .MuiListItemSecondaryAction-root": {
          position: "static",
          transform: "none",
          marginLeft: "auto",

          display: "flex",
          alignItems: "center",
        },
      }}
    />
  );
}
