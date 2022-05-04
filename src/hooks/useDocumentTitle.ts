import { useEffect } from "react";

const DOCUMENT_TITLE_BASE =
  "Rowy" +
  (process.env.NODE_ENV === "production"
    ? ""
    : ` (${
        process.env.REACT_APP_FIREBASE_EMULATOR ? "Emulator • " : ""
      }${process.env.NODE_ENV.replace("development", "dev")})`);

/**
 * Sets the document/tab title and resets when the page is changed
 * @param projectId - Project ID displayed in the title
 * @param title - Title to be displayed
 */
export function useDocumentTitle(projectId: string, title?: string) {
  useEffect(() => {
    document.title = [title, projectId, DOCUMENT_TITLE_BASE]
      .filter(Boolean)
      .join(" • ");

    return () => {
      document.title = [projectId, DOCUMENT_TITLE_BASE].join(" • ");
    };
  }, [title, projectId]);
}

export default useDocumentTitle;
