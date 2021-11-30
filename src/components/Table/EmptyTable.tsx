import { Grid, Stack, Typography, Button, Divider } from "@mui/material";
import ImportIcon from "@src/assets/icons/Import";
import AddColumnIcon from "@src/assets/icons/AddColumn";

import { APP_BAR_HEIGHT } from "@src/components/Navigation";

import { useProjectContext } from "@src/contexts/ProjectContext";
import ColumnMenu from "./ColumnMenu";
import ImportWizard from "@src/components/Wizards/ImportWizard";
import ImportCSV from "@src/components/TableHeader/ImportCsv";

export default function EmptyTable() {
  const { tableState, importWizardRef, columnMenuRef } = useProjectContext();

  let contents = <></>;

  if (tableState?.rows && tableState!.rows.length > 0) {
    contents = (
      <>
        <div>
          <Typography variant="h6" component="h2" gutterBottom>
            Get started
          </Typography>
          <Typography>
            There is existing data in the Firestore collection:
            <br />
            <code>{tableState?.tablePath}</code>
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
            onClick={() => importWizardRef?.current?.setOpen(true)}
          >
            Import
          </Button>

          <ImportWizard />
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
            <code>{tableState?.tablePath}</code>
          </Typography>
        </div>

        <Grid container spacing={1}>
          <Grid item xs>
            <Typography paragraph>
              You can import data from an external CSV file:
            </Typography>

            <ImportCSV
              render={(onClick) => (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<ImportIcon />}
                  onClick={onClick}
                >
                  Import CSV
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
              onClick={(event) =>
                columnMenuRef?.current?.setSelectedColumnHeader({
                  column: { isNew: true, key: "new", type: "LAST" } as any,
                  anchorEl: event.currentTarget,
                })
              }
              disabled={!columnMenuRef?.current}
            >
              Add column
            </Button>

            <ColumnMenu />
          </Grid>
        </Grid>
      </>
    );
  }

  return (
    <Stack
      spacing={3}
      justifyContent="center"
      alignItems="center"
      sx={{
        height: `calc(100vh - ${APP_BAR_HEIGHT}px)`,
        width: "100%",
        p: 2,
        maxWidth: 480,
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      {contents}
    </Stack>
  );
}
