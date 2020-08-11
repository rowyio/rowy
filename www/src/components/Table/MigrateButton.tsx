import React from "react";
import { FieldType } from "constants/fields";
import { Grid, Button, Tooltip } from "@material-ui/core";
import { useFiretableContext } from "contexts/firetableContext";
import { db } from "../../firebase";
import AlertIcon from "@material-ui/icons/Warning";
const MigrateButton = ({ columns, needsMigration }) => {
  const { tableState } = useFiretableContext();

  const configDocPath = tableState?.config.tableConfig.path;
  const handleColumnMigration = async () => {
    const newColumns = columns.reduce((acc, currCol, currIndex) => {
      const baseCol = {
        ...currCol,
        fieldName: currCol.key,
        index: currIndex,
      };
      if (currCol.type === FieldType.connectTable) {
        const index = currCol.collectionPath;
        delete baseCol.collectionPath;
        return {
          ...acc,
          [currCol.key]: { ...baseCol, config: { ...currCol.config, index } },
        };
      } else if (currCol.type === FieldType.subTable) {
        const parentLabel = [currCol.parentLabel];
        delete baseCol.parentLabel;
        return {
          ...acc,
          [currCol.key]: {
            ...baseCol,
            config: { ...currCol.config, parentLabel },
          },
        };
      } else if (currCol.type === FieldType.action) {
        const callableName = currCol.callableName;
        delete baseCol.callableName;
        return {
          ...acc,
          [currCol.key]: {
            ...baseCol,
            config: { ...currCol.config, callableName },
          },
        };
      } else if (
        [FieldType.multiSelect, FieldType.singleSelect].includes(currCol.type)
      ) {
        const options = currCol.options;
        delete baseCol.options;
        return {
          ...acc,
          [currCol.key]: {
            ...baseCol,
            config: { ...currCol.config, options },
          },
        };
      } else return { ...acc, [currCol.key]: baseCol };
    }, {});
    await db
      .doc(configDocPath)
      .update({ columns: newColumns, oldColumns: columns });
    window.location.reload();
  };
  if (needsMigration)
    return (
      <Grid item>
        <Tooltip
          title={
            "press this to restructure columns to support new column menus"
          }
        >
          <Button
            color="secondary"
            variant="outlined"
            onClick={handleColumnMigration}
          >
            {" "}
            <AlertIcon /> Migrate columns <AlertIcon />
          </Button>
        </Tooltip>
      </Grid>
    );
  else return <></>;
  //   else
  //     return (
  //       <Button
  //         onClick={async () => {
  //           const tableConfigDoc = await db.doc(configDocPath).get();
  //           const tableConfig = tableConfigDoc.data();
  //           await db
  //             .doc(configDocPath)
  //             .update({ columns: tableConfig?.oldColumns });
  //         }}
  //       >
  //         Undo
  //       </Button>
  //     );
};
export default MigrateButton;
