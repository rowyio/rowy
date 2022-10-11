import { useAtom, useSetAtom } from "jotai";
import { Offline, Online } from "react-detect-offline";

import { Grid, Stack, Typography, Button, Divider } from "@mui/material";
import {
  Import as ImportIcon,
  AddColumn as AddColumnIcon,
} from "@src/assets/icons";
import OfflineIcon from "@mui/icons-material/CloudOff";

import EmptyState from "@src/components/EmptyState";
import ImportData from "@src/components/TableToolbar/ImportData/ImportData";

import {
  tableScope,
  tableSettingsAtom,
  tableRowsAtom,
  columnModalAtom,
  tableModalAtom,
} from "@src/atoms/tableScope";
import { TOP_BAR_HEIGHT } from "@src/layouts/Navigation/TopBar";

export default function EmptyTable() {
  const openColumnModal = useSetAtom(columnModalAtom, tableScope);
  const openTableModal = useSetAtom(tableModalAtom, tableScope);

  const [tableSettings] = useAtom(tableSettingsAtom, tableScope);
  const [tableRows] = useAtom(tableRowsAtom, tableScope);
  // const { tableState, importWizardRef, columnMenuRef } = useProjectContext();

  let contents = <></>;

  if (tableRows.length > 0) {
    contents = (
      <>
        <div>
          <Typography variant="h6" component="h2" gutterBottom>
            Get started
          </Typography>
          <Typography>
            There is existing data in the Firestore collection:
            <br />
            <code>{tableSettings.collection}</code>
          </Typography>
        </div>

        <div>
          <Typography paragraph>
            You can import that existing data to this table.
          </Typography>

          <Button
            variant="contained"
            color="primary"
            startIcon={<ImportIcon />}
            onClick={() => openTableModal("importExisting")}
          >
            Import existing data
          </Button>
        </div>
      </>
    );
  } else {
    contents = (
      <>
        <div>
          <Typography variant="h6" component="h2" gutterBottom>
            Get started
          </Typography>
          <Typography>
            There is no data in the Firestore collection:
            <br />
            <code>{tableSettings.collection}</code>
          </Typography>
        </div>

        <Grid container spacing={1}>
          <Grid item xs>
            <Typography paragraph>
              You can import data from an external source:
            </Typography>

            <ImportData
              render={(onClick) => (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<ImportIcon />}
                  onClick={onClick}
                >
                  Import data
                </Button>
              )}
              PopoverProps={{
                anchorOrigin: {
                  vertical: "bottom",
                  horizontal: "center",
                },
                transformOrigin: {
                  vertical: "top",
                  horizontal: "center",
                },
              }}
            />
          </Grid>

          <Grid item>
            <Divider orientation="vertical">
              <Typography variant="overline">or</Typography>
            </Divider>
          </Grid>

          <Grid item xs>
            <Typography paragraph>
              You can manually add new columns and rows:
            </Typography>

            <Button
              variant="contained"
              color="primary"
              startIcon={<AddColumnIcon />}
              onClick={() => openColumnModal({ type: "new" })}
            >
              Add column
            </Button>
          </Grid>
        </Grid>
      </>
    );
  }

  return (
    <>
      <Offline>
        <EmptyState
          role="alert"
          Icon={OfflineIcon}
          message="You’re offline"
          description="Go online to view this table’s data"
          style={{ height: `calc(100vh - ${TOP_BAR_HEIGHT}px)` }}
        />
      </Offline>

      <Online>
        <Stack
          spacing={3}
          justifyContent="center"
          alignItems="center"
          sx={{
            height: `calc(100vh - ${TOP_BAR_HEIGHT}px)`,
            width: "100%",
            p: 2,
            maxWidth: 480,
            margin: "0 auto",
            textAlign: "center",
          }}
          id="empty-table"
        >
          {contents}
        </Stack>
      </Online>
    </>
  );
}
