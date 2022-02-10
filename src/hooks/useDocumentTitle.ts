import { useEffect } from "react";

export default function useDocumentTitle(projectId: string, title?: string) {
  useEffect(() => {
    document.title = [
      title,
      projectId,
      "Rowy",
      window.location.hostname === "localhost" ? "localhost" : "",
    ]
      .filter((x) => x)
      .join(" • ");

    return () => {
      document.title = [
        projectId,
        "Rowy",
        window.location.hostname === "localhost" ? "localhost" : "",
      ]
        .filter((x) => x)
        .join(" • ");
    };
  }, [title, projectId]);
}
