import { useEffect } from "react";
import { name } from "@root/package.json";

export default function useDocumentTitle(projectId: string, title?: string) {
  useEffect(() => {
    console.log("set document title", projectId);
    document.title = [
      title,
      projectId,
      name + (window.location.hostname === "localhost" ? " (localhost)" : ""),
    ]
      .filter((x) => x)
      .join(" • ");

    return () => {
      document.title = [
        projectId,
        name + (window.location.hostname === "localhost" ? " (localhost)" : ""),
      ]
        .filter((x) => x)
        .join(" • ");
    };
  }, [title, projectId]);
}
