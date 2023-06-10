import { useEffect } from "react";

const DOCUMENT_TITLE_BASE =
  "Rowy" +
  (import.meta.env.MODE === "production"
    ? ""
    : ` (${
        import.meta.env.VITE_APP_FIREBASE_EMULATORS ? "Emulator • " : ""
      }${import.meta.env.MODE.replace("development", "dev")})`);

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
