import { useMemo } from "react";
import { format } from "date-fns";
import MDEditor from "@uiw/react-md-editor";

import {
  Box,
  Grid,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";

import EditIcon from "@mui/icons-material/EditOutlined";

import { tableScope, tableSettingsAtom } from "@src/atoms/tableScope";
import { useAtom, useSetAtom } from "jotai";
import {
  projectScope,
  tablesAtom,
  tableSettingsDialogAtom,
  userRolesAtom,
} from "@src/atoms/projectScope";
import { find } from "lodash-es";

export interface IDetailsProps {
  handleOpenTemplate?: any;
}

export default function Details({ handleOpenTemplate }: IDetailsProps) {
  const [userRoles] = useAtom(userRolesAtom, projectScope);
  const [tableSettings] = useAtom(tableSettingsAtom, tableScope);
  const [tables] = useAtom(tablesAtom, projectScope);
  const openTableSettingsDialog = useSetAtom(
    tableSettingsDialogAtom,
    projectScope
  );

  const settings = useMemo(
    () => find(tables, ["id", tableSettings.id]),
    [tables, tableSettings.id]
  );

  const theme = useTheme();

  if (!settings) {
    return null;
  }

  const editButton = userRoles.includes("ADMIN") && (
    <IconButton
      sx={{
        position: "absolute",
        right: 0,
      }}
      onClick={() =>
        openTableSettingsDialog({
          mode: "update",
          data: settings,
        })
      }
      disabled={!openTableSettingsDialog || settings.id.includes("/")}
    >
      <EditIcon />
    </IconButton>
  );

  const { description, details, _createdBy } = settings;

  return (
    <Grid
      container
      flexDirection="column"
      gap={3}
      sx={{
        paddingTop: theme.spacing(3),
        paddingRight: theme.spacing(3),
        paddingBottom: theme.spacing(5),
        "& > .MuiGrid-root": {
          position: "relative",
        },
      }}
    >
      {/* Description */}
      <Grid container direction="column" gap={1}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            Description
          </Typography>
          {editButton}
        </Stack>
        <Typography variant="body2" color="text.secondary">
          {description ? description : "No description"}
        </Typography>
      </Grid>

      {/* Details */}
      <Grid container direction="column" gap={1}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            Details
          </Typography>
          {editButton}
        </Stack>
        {!details ? (
          <Typography variant="body2" color="text.secondary">
            No details
          </Typography>
        ) : (
          <Box
            sx={{
              color: "text.secondary",
            }}
          >
            <MDEditor.Markdown source={details} />
          </Box>
        )}
      </Grid>

      {/* Table Audits */}
      {_createdBy && (
        <Grid
          container
          sx={{
            fontSize: theme.typography.body2,
          }}
        >
          <Typography
            variant="caption"
            color="text.secondary"
            component="div"
            style={{ whiteSpace: "normal" }}
          >
            Created by{" "}
            <Typography variant="caption" color="text.primary">
              {_createdBy.displayName}
            </Typography>{" "}
            at{" "}
            <Typography variant="caption" color="text.primary">
              {format(_createdBy.timestamp.toDate(), "LLL d, yyyy · p")}
            </Typography>
          </Typography>
        </Grid>
      )}

      {/* Template Settings */}
      {/* {handleOpenTemplate && (
        <Divider sx={{ my: 1.5 }} />
         <Button
      sx={{ width: "100%", boxShadow: "none", padding: 0 }}
      onClick={handleOpenTemplate}
      >
      <Stack
      direction="row"
      justify-content="flex-start"
      alignItems="center"
      sx={{ width: "100%" }}
      >
      <ChevronLeft />
      <ListItemText
      primary="Template - Roadmap"
      secondary={<StepsProgress steps={5} value={3} />}
      sx={{ maxWidth: "188px" }}
      />
      </Stack
    </Button> 
      )} */}
    </Grid>
  );
}
