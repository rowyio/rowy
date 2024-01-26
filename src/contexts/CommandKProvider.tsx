import { useTheme } from "@mui/material";
import {
  navOpenAtom,
  projectScope,
  tableSettingsDialogAtom,
} from "@src/atoms/projectScope";
import KbarRenderResults from "@src/components/Kbar/KbarRenderResults";
import { useSetAtom } from "jotai";
import {
  KBarAnimator,
  KBarPortal,
  KBarPositioner,
  KBarProvider,
  KBarSearch,
} from "kbar";
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

const CommandKProvider = ({ children }: { children: ReactNode }) => {
  const theme = useTheme();
  const setTableSettingsDialog = useSetAtom(
    tableSettingsDialogAtom,
    projectScope
  );
  const setNavOpen = useSetAtom(navOpenAtom, projectScope);
  const navigate = useNavigate();

  // styles according to kbar docs
  const searchStyle = {
    padding: "16px 16px",
    fontSize: "16px",
    width: "100%",
    boxSizing: "border-box" as React.CSSProperties["boxSizing"],
    outline: "none",
    border: "none",
    background: theme.palette.mode === "dark" ? "#1C1C1F" : "#FFFFFF", //bgColor based on theme
    color: theme.palette.text.primary,
    zIndex: "2000",
  };

  const animatorStyle = {
    maxWidth: "600px",
    width: "100%",
    background: theme.palette.mode === "dark" ? "#1C1C1F" : "#FFFFFF",
    color: theme.palette.text.primary,
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0px 6px 20px rgb(0 0 0 / 30%)",
    zIndex: "2000",
  };

  // Static actions
  const actions = [
    {
      id: "tables",
      name: "Tables",
      shortcut: ["t"], // hotkey for this action
      keywords: "Go to tables page",
      perform: () => navigate("/tables"),
    },
    {
      id: "tableTutorial",
      name: "Tables Tutorial",
      shortcut: ["j"],
      keywords: "Go through a tutorial",
      perform: () => navigate("/tutorial/table"),
    },
    {
      id: "settings",
      name: "Settings",
      shortcut: ["s"],
      keywords: "Go to settings",
      perform: () => navigate("/settings"),
    },
    {
      id: "userSettings",
      name: "User settings",
      shortcut: ["u"],
      keywords: "Go to user settings",
      perform: () => navigate("/settings/user"),
    },
    {
      id: "projectSettings",
      name: "Project settings",
      shortcut: ["p"],
      keywords: "Go to project settings",
      perform: () => navigate("/settings/project"),
    },
    {
      id: "members",
      name: "Members page",
      shortcut: ["m"],
      keywords: "Go to Members page",
      perform: () => navigate("/members"),
    },
    {
      id: "debug",
      name: "Debug",
      shortcut: ["d"],
      keywords: "Debug",
      perform: () => navigate("/debug"),
    },
    {
      id: "createTable",
      name: "Create Table",
      shortcut: ["c"],
      keywords: "create",
      perform: () => {
        setTableSettingsDialog({ open: true });
      },
    },
    {
      id: "toggleNav",
      name: "Toggle Nav Drawer",
      shortcut: ["n"],
      keywords: "toggle",
      perform: () => {
        setNavOpen((value) => !value);
      },
    },
  ];
  return (
    <KBarProvider actions={actions} options={{ enableHistory: true }}>
      <KBarPortal>
        <KBarPositioner style={{ zIndex: 1200 }}>
          <KBarAnimator style={animatorStyle}>
            <KBarSearch style={searchStyle} />
            <KbarRenderResults />
          </KBarAnimator>
        </KBarPositioner>
      </KBarPortal>
      {children}
    </KBarProvider>
  );
};

export default CommandKProvider;