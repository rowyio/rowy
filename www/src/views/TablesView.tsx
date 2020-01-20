import React from "react";

import { createStyles, makeStyles, Grid } from "@material-ui/core";

import useSettings from "../hooks/useSettings";
import routes from "../constants/routes";

import CreateTableDialog from "../components/CreateTableDialog";
import StyledCard from "../components/StyledCard";

const useStyles = makeStyles(() => createStyles({}));

const TablesView = () => {
  const classes = useStyles();

  const [settings, createTable] = useSettings();
  const tables = settings.tables;

  return (
    <>
      <Grid container spacing={4}>
        {Array.isArray(tables)
          ? tables.map((table: any) => (
              <Grid item lg={4}>
                <StyledCard
                  overline="Primary"
                  title={table.name}
                  bodyContent={table.description}
                  primaryLink={{
                    to: `${routes.table}/${table.collection}`,
                    label: "Open",
                  }}
                />
              </Grid>
            ))
          : "TODO: card skeleton"}
      </Grid>

      <CreateTableDialog createTable={createTable} />
    </>
  );
};

export default TablesView;
