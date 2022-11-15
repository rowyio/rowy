import { useAtom, Atom } from "jotai";
import { useLocation, Navigate } from "react-router-dom";

import Loading from "@src/components/Loading";

import { projectScope, currentUserAtom } from "@src/atoms/projectScope";
import { ROUTES } from "@src/constants/routes";

export interface IRequireAuthProps {
  children: React.ReactElement;
  atom?: Atom<any>;
  scope?: Parameters<typeof useAtom>[1];
}

export default function RequireAuth({
  children,
  atom = currentUserAtom,
  scope = projectScope,
}: IRequireAuthProps) {
  const [currentUser] = useAtom(atom, scope);
  const location = useLocation();

  if (currentUser === undefined)
    return <Loading fullScreen message="Authenticating" />;

  const redirect =
    (location.pathname ?? "") + (location.search ?? "") + (location.hash ?? "");

  if (currentUser === null)
    return (
      <Navigate
        to={ROUTES.auth + `?redirect=${encodeURIComponent(redirect)}`}
        replace
        state={location.state}
      />
    );

  return children;
}
