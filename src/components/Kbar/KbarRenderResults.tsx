import { KBarResults, useMatches } from "kbar";
import KbarResultItem from "./KbarResultItem";
import { useTheme } from "@mui/material";

const KbarRenderResults: React.FC = () => {
  const { results, rootActionId } = useMatches();
  const theme = useTheme();

  const groupNameStyle = {
    padding: "12px 16px",
    fontSize: "10px",
    textTransform: "uppercase" as const,
    opacity: 0.5,
    background: theme.palette.mode === "dark" ? "#1C1C1F" : "#FFFFFF",
    zIndex: 2000,
  };

  return (
    <KBarResults
      items={results}
      maxHeight={300}
      onRender={({ item, active }) =>
        typeof item === "string" ? (
          <div style={groupNameStyle}>{item}</div>
        ) : (
          <KbarResultItem
            action={item}
            active={active}
            currentRootActionId={rootActionId}
          />
        )
      }
    />
  );
};

export default KbarRenderResults;
