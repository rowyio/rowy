import { useParams, useLocation, Navigate } from "react-router-dom";
import { ROUTES } from "@src/constants/routes";

/**
 * Redirect /tableGroups/:id links to /table/:id
 */
export default function TableGroupRedirect() {
  const { id } = useParams();
  const { search, hash } = useLocation();

  if (!id) return <Navigate to={ROUTES.tables} replace />;
  return <Navigate to={ROUTES.table + "/" + id + search + hash} replace />;
}
