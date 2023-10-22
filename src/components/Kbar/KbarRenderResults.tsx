import { KBarResults, useMatches } from "kbar";
import KbarResultItem from "./KbarResultItem";

const groupNameStyle = {
  padding: "12px 16px",
  fontSize: "10px",
  textTransform: "uppercase" as const,
  opacity: 0.5,
  background: "#1C1C1F",
  zIndex: 2000,
};

const KbarRenderResults: React.FC = () => {
  const { results, rootActionId } = useMatches();
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
