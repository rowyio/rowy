import { useEffect } from "react";

/**
 * Sets the document/tab title and resets when the page is changed
 * @param projectId - Project ID displayed in the title
 * @param title - Title to be displayed
 */
export function useDocumentTitle(projectId: string, title?: string) {
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

export default useDocumentTitle;
