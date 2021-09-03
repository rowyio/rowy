import { useEffect, useState } from "react";
import createPersistedState from "use-persisted-state";

import { Typography, Link, Button } from "@material-ui/core";
import LoadingButton from "@material-ui/lab/LoadingButton";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import Modal from "components/Modal";

import { useRowyContext } from "contexts/RowyContext";
import { useConfirmation } from "components/ConfirmationDialog";
import { db, projectId } from "@src/firebase";
import { name } from "@root/package.json";
import { SETTINGS, TABLE_SCHEMAS } from "config/dbPaths";
import { WIKI_LINKS } from "constants/wikiLinks";

const useMigrateToV2State = createPersistedState("__ROWY__MIGRATE_TO_V2");

const checkIfMigrationRequired = async () => {
  const oldSettingsExists = (await db.doc("_FIRETABLE_/settings").get()).exists;
  if (!oldSettingsExists) return false;

  const migrated =
    (await db.doc(SETTINGS).get()).data()?.migratedToV2 !== undefined;
  if (migrated) return false;

  const tableSchemas = (
    await db.collection("_FIRETABLE_/settings/schema").get()
  ).size;
  if (tableSchemas === 0) return false;

  return tableSchemas;
};

const migrate = async () => {
  const oldSettings = (await db.doc("_FIRETABLE_/settings").get()).data() ?? {};
  await db
    .doc(SETTINGS)
    .set({ ...oldSettings, buildUrl: oldSettings.ftBuildUrl }, { merge: true });

  const tables = await db.collection("_FIRETABLE_/settings/schema").get();
  const promises = tables.docs.map((table) =>
    db
      .collection(TABLE_SCHEMAS)
      .doc(table.id)
      .set(table.data(), { merge: true })
  );

  await Promise.all(promises);
  await db.doc(SETTINGS).update({ migratedToV2: true });
};

export default function MigrateToV2() {
  const { userClaims } = useRowyContext();
  const { requestConfirmation } = useConfirmation();

  const [requiresMigration, setRequiresMigration] = useMigrateToV2State<
    null | false | number
  >(null);

  const [migrationStatus, setMigrationStatus] = useState<
    "IDLE" | "MIGRATING" | "COMPLETE"
  >("IDLE");

  useEffect(() => {
    if (
      Array.isArray(userClaims?.roles) &&
      userClaims?.roles.includes("ADMIN") &&
      requiresMigration !== false
    ) {
      checkIfMigrationRequired().then(setRequiresMigration);
    }
  }, [userClaims, requiresMigration, setRequiresMigration]);

  if (migrationStatus === "COMPLETE")
    return (
      <Modal
        title={`Welcome to ${name}!`}
        onClose={() => {
          setMigrationStatus("IDLE");
          setRequiresMigration(false);
        }}
        hideCloseButton
        maxWidth="xs"
        body="Your project settings and tables have been successfully migrated."
        actions={{
          primary: {
            children: "Continue",
            onClick: () => {
              setMigrationStatus("IDLE");
            },
          },
        }}
      />
    );

  if (!requiresMigration) return null;

  const freshStart = async () => {
    await db.doc(SETTINGS).update({ migratedToV2: false });
    setRequiresMigration(false);
  };

  return (
    <Modal
      title={`Migrate to ${name}`}
      onClose={() => {}}
      disableBackdropClick
      disableEscapeKeyDown
      hideCloseButton
      maxWidth="xs"
      body={
        <>
          <div>
            <Typography gutterBottom>
              It looks like your Firestore database is configured for Firetable.
              You can migrate your configuration, including your{" "}
              <strong>{requiresMigration} tables</strong>, to {name}.
            </Typography>

            <Typography>
              Alternatively, you can{" "}
              <Link
                onClick={() => {
                  requestConfirmation({
                    title: "Continue without migrating?",
                    body: `You will start a new ${name} project without your existing config or tables.`,
                    handleConfirm: freshStart,
                  });
                }}
                component="button"
                color="inherit"
                variant="body2"
                display="inline"
                style={{ verticalAlign: "baseline" }}
              >
                skip migration
              </Link>
              .
            </Typography>
          </div>

          <div>
            <Typography variant="subtitle1" gutterBottom>
              1. Update your Firestore Security Rules
            </Typography>

            <Typography>
              Add the required rules to your Firestore Security Rules.
            </Typography>
          </div>

          <Button
            href={WIKI_LINKS.securityRules + "#required-rules"}
            target="_blank"
            rel="noopener noreferrer"
            endIcon={<OpenInNewIcon aria-label="Open in new tab" />}
            fullWidth
            sx={{ mt: 1 }}
          >
            Copy Required Rules
          </Button>

          <Button
            href={`https://console.firebase.google.com/project/${projectId}/firestore/rules`}
            target="_blank"
            rel="noopener noreferrer"
            endIcon={<OpenInNewIcon aria-label="Open in new tab" />}
            fullWidth
            sx={{ mt: 1 }}
          >
            Set Rules in Firebase Console
          </Button>

          <div>
            <Typography variant="subtitle1" gutterBottom>
              2. Migrate your config and tables
            </Typography>

            <LoadingButton
              variant="contained"
              color="primary"
              fullWidth
              loading={migrationStatus === "MIGRATING"}
              onClick={() => {
                setMigrationStatus("MIGRATING");
                migrate()
                  .then(() => {
                    setMigrationStatus("COMPLETE");
                    setRequiresMigration(false);
                  })
                  .catch((e) => {
                    setMigrationStatus("IDLE");
                    alert(
                      "Failed to migrate. Please check you have set the Firestore Security Rules correctly.\n\n" +
                        e.message
                    );
                  });
              }}
            >
              Migrate
            </LoadingButton>
          </div>
        </>
      }
    />
  );
}
