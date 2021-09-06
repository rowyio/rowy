import { useState, ChangeEvent } from "react";
import createPersistedState from "use-persisted-state";
import _groupBy from "lodash/groupBy";
import _find from "lodash/find";

import {
  Container,
  Stack,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Tooltip,
  Fab,
  Checkbox,
  IconButton,
  Zoom,
} from "@material-ui/core";
import ViewListIcon from "@material-ui/icons/ViewListOutlined";
import ViewGridIcon from "@material-ui/icons/ViewModuleOutlined";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";
import EditIcon from "@material-ui/icons/EditOutlined";
import AddIcon from "@material-ui/icons/Add";

import FloatingSearch from "components/FloatingSearch";
import TableGrid from "components/Home/TableGrid";
import TableList from "components/Home/TableList";
import TableGridSkeleton from "components/Home/TableGrid/TableGridSkeleton";
import TableListSkeleton from "components/Home/TableList/TableListSkeleton";
import HomeWelcomePrompt from "components/Home/HomeWelcomePrompt";
import AccessDenied from "components/Home/AccessDenied";

import routes from "constants/routes";
import { useAppContext } from "contexts/AppContext";
import { useRowyContext, Table } from "contexts/RowyContext";
import useDoc, { DocActions } from "hooks/useDoc";
import useBasicSearch from "hooks/useBasicSearch";
import TableSettingsDialog, {
  TableSettingsDialogModes,
} from "components/TableSettings";

import { SETTINGS } from "config/dbPaths";

const useHomeViewState = createPersistedState("__ROWY__HOME_VIEW");

export default function HomePage() {
  const { userDoc } = useAppContext();
  const { tables, userClaims } = useRowyContext();

  const [results, query, handleQuery] = useBasicSearch(
    tables ?? [],
    (table, query) =>
      table.id.toLowerCase().includes(query) ||
      table.name.toLowerCase().includes(query) ||
      table.section.toLowerCase().includes(query) ||
      table.description.toLowerCase().includes(query)
  );

  const [view, setView] = useHomeViewState("grid");

  const favorites = Array.isArray(userDoc.state.doc?.favoriteTables)
    ? userDoc.state.doc.favoriteTables
    : [];
  const sections = {
    Favorites: favorites.map((id) => _find(results, { id })),
    ..._groupBy(results, "section"),
  };

  const [settingsDialogState, setSettingsDialogState] = useState<{
    mode: null | TableSettingsDialogModes;
    data: null | (Table & { tableType: string });
  }>({ mode: null, data: null });

  const clearDialog = () =>
    setSettingsDialogState({
      mode: null,
      data: null,
    });

  const handleCreateTable = () =>
    setSettingsDialogState({
      mode: TableSettingsDialogModes.create,
      data: null,
    });

  const [settingsDocState] = useDoc(
    { path: SETTINGS },
    { createIfMissing: true }
  );

  if (!Array.isArray(tables))
    return view === "list" ? <TableListSkeleton /> : <TableGridSkeleton />;

  if (settingsDocState.error?.code === "permission-denied")
    return <AccessDenied />;

  const createTableFab = (
    <Tooltip title="Create Table">
      <Zoom in>
        <Fab
          color="secondary"
          aria-label="Create table"
          onClick={handleCreateTable}
          sx={{
            zIndex: "speedDial",
            position: "fixed",
            bottom: (theme) => ({ xs: theme.spacing(2), sm: theme.spacing(3) }),
            right: (theme) => ({ xs: theme.spacing(2), sm: theme.spacing(3) }),
          }}
        >
          <AddIcon />
        </Fab>
      </Zoom>
    </Tooltip>
  );

  if (tables.length === 0 && userClaims.roles.includes("ADMIN"))
    return (
      <>
        <HomeWelcomePrompt />
        {createTableFab}
      </>
    );

  const getLink = (table: Table) =>
    `${
      table.isCollectionGroup ? routes.tableGroup : routes.table
    }/${table.id.replace(/\//g, "~2F")}`;

  const handleFavorite = (id: string) => (e: ChangeEvent<HTMLInputElement>) => {
    const newFavorites = e.target.checked
      ? [...favorites, id]
      : favorites.filter((f) => f !== id);

    userDoc.dispatch({
      action: DocActions.update,
      data: { favoriteTables: newFavorites },
    });
  };

  const getActions = (table: Table) => (
    <>
      {userClaims.roles.includes("ADMIN") && (
        <IconButton
          aria-label="Edit table"
          onClick={() =>
            setSettingsDialogState({
              mode: TableSettingsDialogModes.update,
              data: table as any,
            })
          }
          size={view === "list" ? "large" : undefined}
        >
          <EditIcon />
        </IconButton>
      )}
      <Checkbox
        onChange={handleFavorite(table.id)}
        checked={favorites.includes(table.id)}
        icon={<FavoriteBorderIcon />}
        checkedIcon={
          <Zoom in>
            <FavoriteIcon />
          </Zoom>
        }
        name={`favorite-${table.id}`}
        inputProps={{ "aria-label": "Favorite" }}
        sx={view === "list" ? { p: 1.5 } : undefined}
        color="secondary"
      />
    </>
  );

  return (
    <Container component="main" sx={{ px: 1, pt: 1, pb: 7 + 3 + 3 }}>
      <FloatingSearch
        label="Search Tables"
        onChange={(e) => handleQuery(e.target.value)}
        paperSx={{
          maxWidth: (theme) => theme.breakpoints.values.sm - 48,
          width: { xs: "100%", md: "50%", lg: "100%" },
          mx: "auto",
          mb: { xs: 2, md: -6 },
        }}
      />

      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
      >
        <Typography
          variant="h6"
          component="h1"
          sx={{ pl: 2, cursor: "default" }}
        >
          {query ? `${results.length} of ${tables.length}` : tables.length}{" "}
          Tables
        </Typography>

        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={(_, v) => {
            if (v !== null) setView(v);
          }}
          aria-label="Table view"
          sx={{ "& .MuiToggleButton-root": { borderRadius: 2 } }}
        >
          <ToggleButton value="list" aria-label="List view">
            <ViewListIcon style={{ transform: "rotate(180deg)" }} />
          </ToggleButton>
          <ToggleButton value="grid" aria-label="Grid view">
            <ViewGridIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      {view === "list" ? (
        <TableList
          sections={sections}
          getLink={getLink}
          getActions={getActions}
        />
      ) : (
        <TableGrid
          sections={sections}
          getLink={getLink}
          getActions={getActions}
        />
      )}

      {userClaims.roles.includes("ADMIN") && (
        <>
          {createTableFab}
          <TableSettingsDialog
            clearDialog={clearDialog}
            mode={settingsDialogState.mode}
            data={settingsDialogState.data}
          />
        </>
      )}
    </Container>
  );
}
