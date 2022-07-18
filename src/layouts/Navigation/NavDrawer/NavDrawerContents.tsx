import { useAtom, useSetAtom } from "jotai";
import { find, groupBy } from "lodash-es";

import { ListItemIcon, ListItemText, Divider } from "@mui/material";
import HomeIcon from "@mui/icons-material/HomeOutlined";
import AddIcon from "@mui/icons-material/Add";

import NavItem from "./NavItem";
import SettingsNav from "./SettingsNav";
import NavTableSection from "./NavTableSection";

import {
  projectScope,
  userSettingsAtom,
  tablesAtom,
  tableSettingsDialogAtom,
} from "@src/atoms/projectScope";
import { TableSettings } from "@src/types/table";
import { ROUTES } from "@src/constants/routes";

export interface INavDrawerContentsProps {
  closeDrawer: ((e: {}) => void) | undefined;
  open: boolean;
  isPermanent: boolean;
  tempExpanded: boolean;
  setHover: React.Dispatch<React.SetStateAction<boolean | "persist">>;
}

export default function NavDrawerContents({
  closeDrawer,
  open,
  isPermanent,
  tempExpanded,
}: INavDrawerContentsProps) {
  const [tables] = useAtom(tablesAtom, projectScope);
  const [userSettings] = useAtom(userSettingsAtom, projectScope);
  const openTableSettingsDialog = useSetAtom(
    tableSettingsDialogAtom,
    projectScope
  );

  const favorites = Array.isArray(userSettings.favoriteTables)
    ? userSettings.favoriteTables
    : [];
  const sections = {
    Favorites: favorites
      .map((id) => find(tables, { id }))
      .filter((x) => x !== undefined) as TableSettings[],
    ...groupBy(tables, "section"),
  };

  return (
    <>
      <li>
        <NavItem to={ROUTES.tables} onClick={closeDrawer}>
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </NavItem>
      </li>

      <SettingsNav
        closeDrawer={closeDrawer as any}
        collapsed={isPermanent && !open && !tempExpanded}
      />

      <Divider variant="middle" sx={{ my: 1 }} />

      {sections &&
        Object.entries(sections)
          .filter(([, tables]) => tables.length > 0)
          .map(([section, tables]) => (
            <NavTableSection
              key={section}
              section={section}
              tables={tables}
              closeDrawer={closeDrawer}
              collapsed={isPermanent && !open && !tempExpanded}
            />
          ))}

      <li>
        <NavItem
          {...({ component: "button" } as any)}
          onClick={(e: any) => {
            if (closeDrawer) closeDrawer(e);
            openTableSettingsDialog({});
          }}
          sx={{ mb: 1 }}
        >
          <ListItemIcon>
            <AddIcon />
          </ListItemIcon>
          <ListItemText primary="Create table…" />
        </NavItem>
      </li>
    </>
  );
}
